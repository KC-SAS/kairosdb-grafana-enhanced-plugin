import _ from "lodash";
import { SeriesNameBuilder } from "./series_name_builder";

export class KairosDBResponseHandler {
    public convertToDatapoints(data: Response.Body, aliases: string[]) {
        return {
            data: _(_.zip(aliases, data.queries))
                .map((entry) =>
                    _.map(entry[1].results, (result) => {
                        return {
                            datapoints: result.values.map((value) => value.reverse()),
                            target: new SeriesNameBuilder(entry[0] || result.name).withGroupBy(result.group_by).build(),
                        };
                    })
                )
                .flatten()
                .value(),
        };
    }

    public convertToAnnotations(data: Response.Body, options, aliases: string[]) {
        const annotations = [];
        _(_.zip(aliases, data.queries)).forEach((entry) => {
            entry[1].results.forEach((result) => {
                result.values.forEach((value) => {
                    const translatedTags = [];
                    Object.keys(result.tags)
                        .forEach((key) => {
                            result.tags[key].forEach((tagValue) => {
                                translatedTags.push(key + ": " + tagValue.toString());
                            });
                        });

                    annotations.push({
                        annotation: {
                            name: options.name,
                            enabled: true,
                            datasource: options.datasource
                        },
                        title: new SeriesNameBuilder(entry[0] || result.name)
                            .withGroupBy(result.group_by).build().toString(),
                        time: value[0],
                        text: value[1].toString(),
                        tags: translatedTags
                    });
                });
            });
        });

        return annotations;
    }
}
