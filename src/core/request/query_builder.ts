import _ from "lodash";

import {DatapointsQuery, Moment} from "../../beans/request/datapoints_query";
import { MetricQuery } from "../../beans/request/metric_query";
import { KairosDBTarget } from "../../beans/request/target";
import { TemplatingUtils } from "../../utils/templating_utils";
import {computeTimeOffsetMs, TimeOffset} from "../../utils/time_utils";
import {TimeOverride} from "../../beans/features/time_override";

export class KairosDBQueryBuilder {
    private withCredentials: boolean;
    private url: string;
    private apiPath: string;
    private scopedVars: any;

    constructor(withCredentials: boolean, url: string, apiPath: string, templateSrv: any, scopedVars: any) {
        this.withCredentials = withCredentials;
        this.url = url;
        this.apiPath = apiPath;
        this.scopedVars = scopedVars;
        if (templateSrv != null) {
            TemplatingUtils.instanciate(templateSrv, this.scopedVars || {});
        }
    }

    public buildMetricNameQuery() {
        return this.buildRequest({
            method: "GET",
            url: "/metricnames",
        });
    }

    public buildFeaturesQuery() {
        return this.buildRequest({
            method: "GET",
            url: "/features",
        });
    }

    public buildHealthCheckQuery() {
        return this.buildRequest({
           methode: "GET",
           url: "/health/check",
        });
    }

    public buildMetricTagsQuery(metricName: string, filters = {}) {
        return this.buildRequest({
            data: {
                cache_time: 0,
                metrics: [{ name: metricName, tags: filters }],
                start_absolute: 0,
            },
            method: "POST",
            url: "/datapoints/query/tags",
        });
    }

    public buildDatapointsQuery(targets, options, fetch_previous_sample, safeguard) {
        const range = options.range;
        const panelId: string = options.panelId;
        const requests = targets.map((target) => this.buildMetricQuery(target.query, range,
            options.annotation ?
                options.annotation.datasource !== "grafana-skyminer-datasource" : target.datasource !== "grafana-skyminer-datasource"));
        const data = new DatapointsQuery(range.from, range.to, requests, fetch_previous_sample, safeguard);
        return this.buildRequest({
            data,
            method: "POST",
            requestId: `metric_names_${panelId}`,
            url: "/datapoints/query",
        });
    }

    private buildMetricQuery(target: KairosDBTarget, range: any, removeLimits: boolean) {
        return new MetricQuery(
            target.metricName,
            removeLimits,
            this.unpackTags(_.pickBy(target.tags, (tagValues) => tagValues.length)),
            target.features,
            target.group_limit,
            this.computeTimeOverrideFromTimeOffsetAndDashboardRange(target.time_offset, range.from, range.to)
        );
    }

    private computeTimeOverrideFromTimeOffsetAndDashboardRange(timeOffset: TimeOffset,
                                                               startAbsolute: Moment,
                                                               endAbsolute: Moment): TimeOverride {
        if (!timeOffset) {
            return null;
        }

        const start_absolute = startAbsolute.unix() * 1000;
        const end_absolute = endAbsolute.unix() * 1000;

        const timeOverride: TimeOverride = {
            start_absolute: 0, end_absolute: 0
        };

        const timeOffsetInMs = computeTimeOffsetMs(timeOffset);
        timeOverride.start_absolute = start_absolute - timeOffsetInMs;
        timeOverride.end_absolute = end_absolute - timeOffsetInMs;

        return timeOverride;
    }

    private unpackTags(tags) {
        return _.mapValues.bind(this)(tags, (values) => _.flatten(TemplatingUtils.Singleton.replaceAll(values)));
    }

    private buildRequest(requestStub) {
        requestStub.url = this.buildUrl(requestStub.url);
        return _.extend(requestStub, {
            withCredentials: this.withCredentials,
        });
    }

    private buildUrl(urlStub) {
        return `${this.url}${this.apiPath}${urlStub}`;
    }
}
