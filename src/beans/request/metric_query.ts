import _ from "lodash";

import { Feature } from "../features/feature";
import {TimeOverride} from "../features/time_override";
import { Tags } from "./metric_tags";

export class MetricQuery {
    public name: string;
    public tags: Tags;
    public limit: number = 0;
    public group_limit: number = 0;
    public time_override: TimeOverride;

    constructor(name: string,
                removeLimits: boolean,
                tags: Tags,
                features: Feature[],
                group_limit?: number,
                time_override?: TimeOverride) {
        this.name = name;
        this.tags = tags;
        if (group_limit) {
            this.group_limit = group_limit;
        }
        if (time_override) {
            this.time_override = time_override;
        }

        if (removeLimits) {
            delete this.limit;
            delete this.group_limit;
        }

        _.chain(features)
            .map((o) => (Object.assign(Feature.prototype, o) as Feature).serialize())
            .reduce((r, v, k) => _.assign(r, v), this)
            .value();
    }
}
