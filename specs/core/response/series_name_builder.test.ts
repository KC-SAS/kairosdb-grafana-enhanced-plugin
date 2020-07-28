import _ from "lodash";
import forEach from "mocha-each";

import {SeriesNameBuilder} from "../../../src/core/response/series_name_builder";

describe("SeriesNameBuilder", () => {
    const seriesNameBuilder: SeriesNameBuilder = new SeriesNameBuilder();
    const testParameters = [
        ["metricName", [
            {
                group: {
                    key: "GROUPby1",
                    key2: "GROUPby2"
                },
                name: "tag"
            }]
        ],
        ["metricName", [
            {
                group: {
                    group_number: 1225345
                },
                name: "value"
            }]
        ],
        ["metricName", [
            {
                group: {
                    group_number: 456
                },
                group_count: 3034,
                name: "time"
            }]
        ],
        ["metricName", [
            {
                group: {
                    group_number: 123
                },
                name: "value"
            },
            {
                group: {
                    group_number: 456
                },
                group_count: 3,
                name: "time"
            }]
        ],
        ["onlyMetricName", [
            {
                group: {
                    key: "GROUPby1",
                    key2: "GROUPby2"
                },
                name: "tag"
            },
            {
                group: {
                    group_number: 123
                },
                name: "value"
            },
            {
                group: {
                    group_number: 456
                },
                group_count: 3,
                name: "time"
            }]
        ],
        ["metricName", [
            {
                group: {
                    key: "GROUPby1",
                    key2: "GROUPby2"
                },
                name: "tag"
            },
            {
                group: {
                    group_number: 123
                },
                name: "value"
            },
            {
                group: {
                    group_number: 456
                },
                group_count: 3,
                name: "time"
            }]
        ]
    ];

    forEach(testParameters).it("should build expected series name from %j",
        (metricName, groupBys) => {
            // when
            const seriesName = new SeriesNameBuilder(metricName).withGroupBy(groupBys).build();
            // then
            seriesName.should.contain(metricName);
            groupBys.forEach((groupBy) => {
                switch (groupBy.name) {
                    case "tag":
                        _.values(groupBy.group).forEach((value) => {
                            seriesName.should.contain(value);
                        });
                        break;
                    case "value":
                        seriesName.should.contain(groupBy.group.group_number);
                        break;
                    case "time":
                        seriesName.should.contain(groupBy.group.group_number);
                        break;
                }
            });
        });

    it("should replace grouping expression for tag, value and time", () => {
        // given
        const metricName = "metricName";
        const groupBys = [
            {
                group: {
                    app_name: "kairosdb",
                    other_tag: "value"
                },
                name: "tag"
            },
            {
                group: {
                    group_number: 0
                },
                name: "value"
            },
            {
                group: {
                    group_number: 1
                },
                name: "value"
            },
            {
                group: {
                    group_number: 2
                },
                name: "value"
            },
            {
                group: {
                    group_number: 0
                },
                group_count: 1,
                name: "time"
            },
            {
                group: {
                    group_number: 1
                },
                group_count: 3,
                name: "time"
            }];

        // when
        const seriesName = new SeriesNameBuilder(metricName).withGroupBy(groupBys).build();
        // then
        // tslint:disable:max-line-length
        seriesName.should.be.equal("metricName(app_name: kairosdb, other_tag: value)(value: group_number=0)(value: group_number=1)(value: group_number=2)(time: group_number=0)(time: group_number=1)");
    });
});
