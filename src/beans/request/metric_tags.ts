import _ from "lodash";

export interface Tags {
    [key: string]: string[];
}

export class MetricTags {
    public tags: Tags = {};
    public size: number;
    public initialized: boolean = false;
    public combinations: number;
    public multiValuedTags: string[];

    public updateTags(tags) {
        this.tags = tags;
        this.updateInfo();
        this.initialized = true;
    }

    private updateInfo() {
        const notEmptyTags = _.pickBy(this.tags, (value) => value.length);
        this.combinations = _.reduce(_.map(notEmptyTags, (values) => values.length), (length1, length2) => length1 * length2);
        this.multiValuedTags = _.keys(_.pickBy(notEmptyTags, (tagValues) => tagValues.length > 1));
        this.size = _.keys(this.tags).length;
    }
}
