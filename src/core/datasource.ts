import _ from "lodash";

import {FeatureComponent} from "../beans/features/component";
import {FeatureTemplate} from "../beans/features/feature";
import {FeatureParameter} from "../beans/features/parameter";
import {TemplateQuery} from "../beans/request/template_query";
import {PromiseUtils} from "../utils/promise_utils";
import {TemplatingUtils} from "../utils/templating_utils";
import {MetricNamesStore} from "./metric_names_store";
import {KairosDBQueryBuilder} from "./request/query_builder";
import {TargetValidator} from "./request/target_validator";
import {KairosDBResponseHandler} from "./response/response_handler";

export class KairosDBDatasource {
    public initialized: boolean = false;
    public initializationError: boolean = false;
    public metricNamesStore: MetricNamesStore;
    public type: string;
    private url: string;
    private withCredentials: boolean;
    private name: string;
    private basicAuth: string;
    private responseHandler: KairosDBResponseHandler;
    private promiseUtils: PromiseUtils;
    private targetValidator: TargetValidator;
    private backendSrv: any;
    private templateSrv: any;

    constructor(instanceSettings, $q, backendSrv, templateSrv) {
        this.type = instanceSettings.type;
        this.url = instanceSettings.url;
        this.name = instanceSettings.name;
        this.withCredentials = instanceSettings.withCredentials;
        this.basicAuth = instanceSettings.basicAuth;

        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;

        this.responseHandler = new KairosDBResponseHandler();
        this.promiseUtils = new PromiseUtils($q);

        TemplatingUtils.instanciate(templateSrv, {});

        this.metricNamesStore = new MetricNamesStore(this, this.promiseUtils, this.url, this.getTemplateVariables());
        this.targetValidator = new TargetValidator();
    }

    public initialize(): void {
        this.metricNamesStore.initialize(this.getTemplateVariables())
            .then(() => (this.initialized = true), () => (this.initializationError = true));
    }

    public unpackTargets(targets) {
        const enabledTargets = _.cloneDeep(
            targets.filter((target) => !target.hide && target.query && target.query.metricName)
        );
        const convertedTargets = enabledTargets;
        convertedTargets.forEach((target) => this.transformSafeGuard(target));

        if (!this.targetValidator.areValidTargets(convertedTargets)) {
            return; // todo: target validation, throw message to grafana with detailed info
        }

        const extractedAliases = convertedTargets.map((target) => target.query.alias);

        let extactedFetchPreviousSample = null;
        let extactedSafeguard = null;

        const unpackedTargets = convertedTargets.map((target) => {
            const clonedTarget = _.cloneDeep(target);
            // process parsing and changes of template variable only if needed
            // replace metric name in case of template metric name
            clonedTarget.query.metricName = TemplatingUtils.Singleton.replace(target.query.metricName)[0];
            // replace filters names and values in case of template tags names and values
            if (clonedTarget.filters) {
                clonedTarget.filters.map((filter) => {
                    filter.name = TemplatingUtils.Singleton.replace(filter.name)[0];
                    filter.values = filter.values.reduce((acc, value) => {
                        return [...acc, ...TemplatingUtils.Singleton.replace(value)];
                    }, []);
                });

                // add custom filters to query tags
                clonedTarget.filters.forEach((filter) => {
                    clonedTarget.query.tags[filter.name] = filter.values;
                });
            }

            clonedTarget.query.features.forEach((feature) => {
                feature.components.forEach((component) => {
                    component.parameters.forEach((parameter) => {
                        if (parameter.type === "object") {
                            parameter.parameters.forEach((subParameter) => {
                                if (typeof(subParameter.value) === "string") {
                                    subParameter.value = TemplatingUtils.Singleton.replace(subParameter.value)[0];
                                }
                            });
                        } else {
                            if (typeof(parameter.value) === "string") {
                                parameter.value = TemplatingUtils.Singleton.replace(parameter.value)[0];
                            }
                        }
                    });
                });
            });

            if (clonedTarget.fetch_previous_sample) {
                extactedFetchPreviousSample = clonedTarget.fetch_previous_sample;
            }
            delete clonedTarget.fetch_previous_sample;

            if (clonedTarget.safeguard) {
                extactedSafeguard = clonedTarget.safeguard;
            }
            delete clonedTarget.safeguard;
            return clonedTarget;
        });

        return {
            targets: unpackedTargets,
            aliases: extractedAliases,
            fetch_previous_sample: extactedFetchPreviousSample,
            safeguard: extactedSafeguard
        };
    }

    public query(options) {
        const unpackedTargets = this.unpackTargets(options.targets);

        const requestBuilder = this.getRequestBuilder(options.scopedVars);

        return this.executeRequest(requestBuilder.buildDatapointsQuery(
            unpackedTargets.targets,
            options,
            unpackedTargets.fetch_previous_sample,
            unpackedTargets.safeguard))
            .then((response) => {
                return this.responseHandler.convertToDatapoints(response.data, unpackedTargets.aliases);
            })
            .catch((errors) => {
                if (errors.data && errors.data.errors) {
                    throw {message: "Request Error: " + errors.data.errors.join(", ")};
                } else {
                    // In case of cancelled request body will be empty
                    // Grafana expect to receive an object with a key data
                    // This line allow to reset graph
                    return {data: []};
                }
            }
        );
    }

    public annotationQuery(options) {
        const unpackedTargets = this.unpackTargets([options.annotation.target]);

        const requestBuilder = this.getRequestBuilder(options.scopedVars);

        return this.executeRequest(requestBuilder.buildDatapointsQuery(
            unpackedTargets.targets,
            options,
            unpackedTargets.fetch_previous_sample,
            unpackedTargets.safeguard))
            .then((response) => {
                return this.responseHandler.convertToAnnotations(response.data, options, unpackedTargets.aliases);
            })
            .catch((errors) => {
                    if (errors.data && errors.data.errors) {
                        throw {message: "Request Error: " + errors.data.errors.join(", ")};
                    } else {
                        // In case of cancelled request body will be empty
                        // Grafana expect to receive an empty array
                        return [];
                    }
                }
            );
    }

    public testDatasource() {
        return this.executeRequest(this.getRequestBuilder().buildHealthCheckQuery())
            .then((response): { status: string, message?: string } => {
                if (response && response.status === 204) {
                    return {
                        status: "success",
                    };
                }
                return {
                    status: "error",
                    message: "Health check fail"
                };
            });
    }

    public fetchMetricNames() {
        this.metricNamesStore.fetch().then(() => (this.initialized = true), () => (this.initializationError = true));
    }

    public getMetricTags(metricNameTemplate, filters = {}) {
        const metricName = TemplatingUtils.Singleton.replace(metricNameTemplate)[0];

        return this.executeRequest(this.getRequestBuilder().buildMetricTagsQuery(metricName, filters)).then(
            this.handleMetricTagsResponse
        );
    }

    public metricFindQuery(query: string) {
        const queryObject = JSON.parse("{" + query + "}") as TemplateQuery;
        const parameters = Object.keys(queryObject);

        if (parameters.length === 0) {
            // get metricnames
            return this.getMetricNames()
                .then((response) => {
                    const metricNames = response.data.results;
                    return metricNames.map((metricName) => this.mapToTemplatingValue(metricName));
                });
        } else if (parameters.length > 2) {
            // post query tags filtered by a metric name and a tag key
            // return all tag values filtered by tag combination
            const queryObjectCopy = _.cloneDeep(queryObject);
            const filters = _.omit(queryObjectCopy, ["metric", "tagKey"]);
            return this.getMetricTags(queryObject.metric, filters)
                .then((tags) => {
                    const tagValues = tags[queryObject.tagKey];
                    return tagValues.map((value) => this.mapToTemplatingValue(value));
                });
        } else if (parameters.length === 2) {
            // post query tags filtered by a metric name and a tag key
            // return all tag values
            return this.getMetricTags(queryObject.metric)
                .then((tags) => {
                    const tagValues = tags[queryObject.tagKey];
                    return tagValues.map((value) => this.mapToTemplatingValue(value));
                });
        } else {
            // post query tags filtered by metric name
            // return all tags keys from response
            return this.getMetricTags(queryObject.metric)
                .then((tags) => {
                    const tagsKeys = Object.keys(tags);
                    return tagsKeys.map((tagKey) => this.mapToTemplatingValue(tagKey));
                });
        }
    }

    public getMetricNames() {
        return this.executeRequest(this.getRequestBuilder().buildMetricNameQuery());
    }

    public getFeatures() {
        return this.executeRequest(this.getRequestBuilder().buildFeaturesQuery()).then((resp) =>
            _.map(resp.data, (o) => new FeatureTemplate(o))
        );
    }

    public getTemplateVariables() {
        if (typeof this.templateSrv.variables !== "undefined") {
            return this.templateSrv.variables.map((variable) => "$" + variable.name);
        }
        return undefined;
    }

    public isTemplateVariable(name: string): boolean {
        return this.getTemplateVariables().indexOf(name) !== -1;
    }

    private getRequestBuilder(scopedVars: any = {}): KairosDBQueryBuilder {
        return new KairosDBQueryBuilder(this.withCredentials, this.url, "/api/v1", this.templateSrv, scopedVars);
    }

    private executeRequest(request) {
        return this.backendSrv.datasourceRequest(request);
    }

    private handleMetricTagsResponse(response): Map<string, Set<string>> {
        return response.data.queries[0].results[0].tags;
    }

    private mapToTemplatingValue(entry) {
        return {
            text: entry,
            value: entry,
        };
    }

    private transformSafeGuard(target) {
        if (target.safeGuard) {
            target.safeguard = target.safeGuard;

            if (target.safeguard.limit === "") {
                delete target.safeguard.limit;
            }
            if (target.safeguard.before_aggregation === "") {
                delete target.safeguard.before_aggregation;
            }
            if (target.safeguard.after_aggregation === "") {
                delete target.safeguard.after_aggregation;
            }
            if (target.safeguard.group_limit === "") {
                delete target.safeguard.group_limit;
            }
        }
        return target;
    }

    private createLimitAggregator(limit: number) {
        return new FeatureComponent("limit", "Limit", [new FeatureParameter("limit", "Limit", "number", limit)]);
    }
}
