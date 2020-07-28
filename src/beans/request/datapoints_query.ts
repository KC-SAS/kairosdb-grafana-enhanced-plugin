import {MetricQuery} from "./metric_query";
import {FetchPreviousSample} from "../features/fetch_previous_sample";
import {SafeGuard} from "../features/safeguard";

// todo: to be replaced with grafana-sdk-mock
export interface Moment {
    unix();
}

export class DatapointsQuery {
    public start_absolute: number;
    public end_absolute: number;
    public metrics: MetricQuery[];
    public cache_time: number = 0;
    private fetch_previous_sample: FetchPreviousSample = null;
    private safeguard: SafeGuard = null;

    constructor(startAbsolute: Moment,
                endAbsolute: Moment,
                metrics: MetricQuery[],
                fetch_previous_sample?: FetchPreviousSample,
                safeguard?: SafeGuard) {
        this.start_absolute = startAbsolute.unix() * 1000;
        this.end_absolute = endAbsolute.unix() * 1000;
        this.metrics = metrics;

        if (fetch_previous_sample) {
            this.fetch_previous_sample = fetch_previous_sample;
        } else {
            delete this.fetch_previous_sample;
        }

        if (safeguard) {
            this.safeguard = safeguard;
        } else {
            delete this.safeguard;
        }
    }
}
