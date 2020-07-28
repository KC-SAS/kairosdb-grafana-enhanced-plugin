import _ from "lodash";

import {KairosDBDatasource} from "./datasource";
import {PromiseUtils} from "../utils/promise_utils";

export class MetricNamesStore {
    private initialized: boolean = false;
    private datasource: KairosDBDatasource;
    private cacheKey: string;
    private fetchingPromise: any;
    private promiseUtils: PromiseUtils;
    private metricNames: string[];
    private templateVariables: string[];

    constructor(datasource: KairosDBDatasource, promiseUtils: PromiseUtils, datasourceUrl: string, templateVariables: string[]) {
        this.cacheKey = "KAIROSDB_METRIC_NAMES_" + datasourceUrl;
        this.promiseUtils = promiseUtils;
        this.datasource = datasource;
        this.templateVariables = templateVariables;
    }

    public initialize(datasourceTemplateVariables): Promise<string[]> {
        // From on dashboard to another variables can change and we need to reload metric names
        if (this.cacheInitialized() && _.isEqual(_.sortBy(this.templateVariables), _.sortBy(datasourceTemplateVariables))) {
            this.initialized = true;
            return this.promiseUtils.resolvedPromise(this.metricNames);
        } else {
            return this.fetch();
        }
    }

    public fetch(): Promise<string[]> {
        this.fetchingPromise = this.datasource.getMetricNames()
            .then((response) => response.data.results)
            .then((metricNames) => {
                this.templateVariables = this.datasource.getTemplateVariables();
                const listOfMetricNames =  _.concat(this.templateVariables, metricNames);
                this.metricNames = listOfMetricNames;
                window[this.cacheKey] = listOfMetricNames;
                this.initialized = true;
                return this.metricNames;
            });
        return this.fetchingPromise;
    }

    public get(): Promise<string[]> {
        if (this.initialized) {
            return this.promiseUtils.resolvedPromise(this.metricNames);
        } else {
            return this.fetchingPromise;
        }
    }

    private cacheInitialized() {
        return !_.isUndefined(window[this.cacheKey]);
    }
}
