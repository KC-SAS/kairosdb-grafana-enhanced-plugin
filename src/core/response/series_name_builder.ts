import _ from "lodash";

export type SeriesName = string;

export class SeriesNameBuilder {
    private seriesName: string;
    private groupBy: Response.GroupBy[] = [];

    constructor(seriesName: string) {
        this.seriesName = seriesName;
    }

    public withGroupBy(groupBy: Response.GroupBy[]): SeriesNameBuilder {
        this.groupBy.push(..._.filter(groupBy, (group: Response.GroupBy) => group.group !== undefined));
        return this;
    }

    public build(): SeriesName {
        return this.seriesName + _.map(this.groupBy, (group) => {
            let groupByString = "(";
            const isGroupByTag = group.name === "tag";
            if (!isGroupByTag) {
                groupByString += `${group.name}: `;
            }
            groupByString += `${this.extractValues(group.group, isGroupByTag)})`;
            return groupByString;
        }).join("");
    }

    private extractValues(values: Response.GroupByValue, isGroupByTag: boolean): string {
        return _.map(Object.getOwnPropertyNames(values), (value) => {
            if (value === "name") {
                return values[value];
            }
            return value + (isGroupByTag ? ": " : "=") + values[value];
        }).join(", ");
    }
}
