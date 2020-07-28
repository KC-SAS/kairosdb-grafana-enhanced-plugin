import _ from "lodash";

import { FeatureTemplate } from "./feature";

/**
 * Predefined features (for legacy systems).
 */
export function LegacyFeatures(): FeatureTemplate[] {
    // tslint:disable:max-line-length
    const FeatureTemplateDefinition: string = `[
        {
          "name": "group_by",
          "label": "Group By",
          "properties": [
            {
              "name": "tag",
              "label": "Tag",
              "description": "Groups data points by tag names.",
              "properties": [
                {
                  "name": "tags",
                  "label": "Tags",
                  "description": "A list of tags to group by.",
                  "optional": false,
                  "type": "array",
                  "options": [],
                  "defaultValue": "[]",
                  "autocomplete": "tags",
                  "multiline": false,
                  "validations": [
                    {
                      "expression": "value.length > 0",
                      "type": "js",
                      "message": "Tags can't be empty."
                    }
                  ]
                }
              ]
            },
            {
              "name": "time",
              "label": "Time",
              "description": "Groups data points in time ranges.",
              "properties": [
                {
                  "name": "group_count",
                  "label": "Count",
                  "description": "The number of groups. This would typically be 7 to group by day of week.",
                  "optional": false,
                  "type": "int",
                  "options": [],
                  "defaultValue": "0",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": [
                    {
                      "expression": "value > 0",
                      "type": "js",
                      "message": "Count must be greater than 0."
                    }
                  ]
                },
                {
                  "name": "range_size",
                  "label": "Range Size",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "value",
              "label": "Value",
              "description": "Groups data points by value.",
              "properties": [
                {
                  "name": "range_size",
                  "label": "Target Size",
                  "description": "The range for each value. For example, if the range size is 10, then values between 0-9 are placed in the first group, values between 10-19 into the second group, and so forth.",
                  "optional": false,
                  "type": "int",
                  "options": [],
                  "defaultValue": "0",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": [
                    {
                      "expression": "value >= 0",
                      "type": "js",
                      "message": "Target size must be greater or equal than 0."
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "aggregators",
          "label": "Aggregator",
          "properties": [
            {
              "name": "avg",
              "label": "AVG",
              "description": "Averages the data points together.",
              "properties": [
                {
                  "name": "align_end_time",
                  "label": "Align end time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The difference between align_start_time and align_end_time is that align_end_time sets the timestamp for the datapoint to the beginning of the following period versus the beginning of the current period. As with align_start_time, setting this to true will cause your data to take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_sampling",
                  "label": "Align sampling",
                  "description": "When set to true the time for the aggregated data point for each range will fall on the start of the range instead of being the value for the first data point within that range. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "true",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_start_time",
                  "label": "Align start time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "sampling",
                  "label": "Sampling",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "count",
              "label": "Count",
              "description": "Counts the number of data points.",
              "properties": [
                {
                  "name": "align_end_time",
                  "label": "Align end time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The difference between align_start_time and align_end_time is that align_end_time sets the timestamp for the datapoint to the beginning of the following period versus the beginning of the current period. As with align_start_time, setting this to true will cause your data to take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_sampling",
                  "label": "Align sampling",
                  "description": "When set to true the time for the aggregated data point for each range will fall on the start of the range instead of being the value for the first data point within that range. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "true",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_start_time",
                  "label": "Align start time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "sampling",
                  "label": "Sampling",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "dev",
              "label": "Dev",
              "description": "Calculates the standard deviation of the time series.",
              "properties": [
                {
                  "name": "align_end_time",
                  "label": "Align end time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The difference between align_start_time and align_end_time is that align_end_time sets the timestamp for the datapoint to the beginning of the following period versus the beginning of the current period. As with align_start_time, setting this to true will cause your data to take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_sampling",
                  "label": "Align sampling",
                  "description": "When set to true the time for the aggregated data point for each range will fall on the start of the range instead of being the value for the first data point within that range. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "true",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_start_time",
                  "label": "Align start time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "sampling",
                  "label": "Sampling",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "diff",
              "label": "Diff",
              "description": "Computes the difference between successive data points.",
              "properties": []
            },
            {
              "name": "div",
              "label": "Div",
              "description": "Divides each data point by a divisor.",
              "properties": [
                {
                  "name": "divisor",
                  "label": "Divisor",
                  "description": "The value each data point is divided by.",
                  "optional": false,
                  "type": "double",
                  "options": [],
                  "defaultValue": "1",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": [
                    {
                      "expression": "value > 0",
                      "type": "js",
                      "message": "Divisor must be greater than 0."
                    }
                  ]
                }
              ]
            },
            {
              "name": "first",
              "label": "First",
              "description": "Returns the first value data point for the time range.",
              "properties": [
                {
                  "name": "align_end_time",
                  "label": "Align end time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The difference between align_start_time and align_end_time is that align_end_time sets the timestamp for the datapoint to the beginning of the following period versus the beginning of the current period. As with align_start_time, setting this to true will cause your data to take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_sampling",
                  "label": "Align sampling",
                  "description": "When set to true the time for the aggregated data point for each range will fall on the start of the range instead of being the value for the first data point within that range. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "true",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_start_time",
                  "label": "Align start time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "sampling",
                  "label": "Sampling",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "gaps",
              "label": "Gaps",
              "description": "Marks gaps in data according to sampling rate with a null data point.",
              "properties": [
                {
                  "name": "align_end_time",
                  "label": "Align end time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The difference between align_start_time and align_end_time is that align_end_time sets the timestamp for the datapoint to the beginning of the following period versus the beginning of the current period. As with align_start_time, setting this to true will cause your data to take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_sampling",
                  "label": "Align sampling",
                  "description": "When set to true the time for the aggregated data point for each range will fall on the start of the range instead of being the value for the first data point within that range. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "true",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_start_time",
                  "label": "Align start time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "sampling",
                  "label": "Sampling",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "last",
              "label": "Last",
              "description": "Returns the last value data point for the time range.",
              "properties": [
                {
                  "name": "align_end_time",
                  "label": "Align end time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The difference between align_start_time and align_end_time is that align_end_time sets the timestamp for the datapoint to the beginning of the following period versus the beginning of the current period. As with align_start_time, setting this to true will cause your data to take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_sampling",
                  "label": "Align sampling",
                  "description": "When set to true the time for the aggregated data point for each range will fall on the start of the range instead of being the value for the first data point within that range. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "true",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_start_time",
                  "label": "Align start time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "sampling",
                  "label": "Sampling",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "least_squares",
              "label": "Least Squares",
              "description": "Returns a best fit line through the datapoints using the least squares algorithm.",
              "properties": [
                {
                  "name": "align_end_time",
                  "label": "Align end time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The difference between align_start_time and align_end_time is that align_end_time sets the timestamp for the datapoint to the beginning of the following period versus the beginning of the current period. As with align_start_time, setting this to true will cause your data to take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_sampling",
                  "label": "Align sampling",
                  "description": "When set to true the time for the aggregated data point for each range will fall on the start of the range instead of being the value for the first data point within that range. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "true",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_start_time",
                  "label": "Align start time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "sampling",
                  "label": "Sampling",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "max",
              "label": "Max",
              "description": "Returns the maximum value data point for the time range.",
              "properties": [
                {
                  "name": "align_end_time",
                  "label": "Align end time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The difference between align_start_time and align_end_time is that align_end_time sets the timestamp for the datapoint to the beginning of the following period versus the beginning of the current period. As with align_start_time, setting this to true will cause your data to take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_sampling",
                  "label": "Align sampling",
                  "description": "When set to true the time for the aggregated data point for each range will fall on the start of the range instead of being the value for the first data point within that range. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "true",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_start_time",
                  "label": "Align start time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "sampling",
                  "label": "Sampling",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "min",
              "label": "Min",
              "description": "Returns the minimum value data point for the time range.",
              "properties": [
                {
                  "name": "align_end_time",
                  "label": "Align end time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The difference between align_start_time and align_end_time is that align_end_time sets the timestamp for the datapoint to the beginning of the following period versus the beginning of the current period. As with align_start_time, setting this to true will cause your data to take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_sampling",
                  "label": "Align sampling",
                  "description": "When set to true the time for the aggregated data point for each range will fall on the start of the range instead of being the value for the first data point within that range. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "true",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_start_time",
                  "label": "Align start time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "sampling",
                  "label": "Sampling",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "percentile",
              "label": "Percentile",
              "description": "Finds the percentile of the data range.",
              "properties": [
                {
                  "name": "align_end_time",
                  "label": "Align end time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The difference between align_start_time and align_end_time is that align_end_time sets the timestamp for the datapoint to the beginning of the following period versus the beginning of the current period. As with align_start_time, setting this to true will cause your data to take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_sampling",
                  "label": "Align sampling",
                  "description": "When set to true the time for the aggregated data point for each range will fall on the start of the range instead of being the value for the first data point within that range. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "true",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_start_time",
                  "label": "Align start time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "percentile",
                  "label": "Percentile",
                  "description": "Data points returned will be in this percentile.",
                  "optional": false,
                  "type": "double",
                  "options": [],
                  "defaultValue": "0.1",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": [
                    {
                      "expression": "value < 1",
                      "type": "js",
                      "message": "Percentile must be smaller than 1."
                    },
                    {
                      "expression": "value > 0",
                      "type": "js",
                      "message": "Percentile must be greater than 0."
                    }
                  ]
                },
                {
                  "name": "sampling",
                  "label": "Sampling",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "rate",
              "label": "Rate",
              "description": "Computes the rate of change for the data points.",
              "properties": [
                {
                  "name": "sampling",
                  "label": "Sampling",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "sma",
              "label": "SMA",
              "description": "Simple moving average.",
              "properties": [
                {
                  "name": "size",
                  "label": "Size",
                  "description": "The period of the moving average. This is the number of data point to use each time the average is calculated.",
                  "optional": false,
                  "type": "int",
                  "options": [],
                  "defaultValue": "10",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": [
                    {
                      "expression": "value > 0",
                      "type": "js",
                      "message": "Size must be greater than 0."
                    }
                  ]
                }
              ]
            },
            {
              "name": "sampler",
              "label": "Sampler",
              "description": "Computes the sampling rate of change for the data points.",
              "properties": [
                {
                  "name": "unit",
                  "label": "Time Unit",
                  "description": "Time unit of sampling",
                  "optional": false,
                  "type": "enum",
                  "options": [
                    "MILLISECONDS",
                    "SECONDS",
                    "MINUTES",
                    "HOURS",
                    "DAYS",
                    "WEEKS",
                    "MONTHS",
                    "YEARS"
                  ],
                  "defaultValue": "milliseconds",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                }
              ]
            },
            {
              "name": "scale",
              "label": "Scale",
              "description": "Scales each data point by a factor.",
              "properties": [
                {
                  "name": "factor",
                  "label": "Factor",
                  "description": "The value to scale each data point by.",
                  "optional": false,
                  "type": "double",
                  "options": [],
                  "defaultValue": "0.0",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": [
                    {
                      "expression": "value > 0",
                      "type": "js",
                      "message": "Factor must be greater than 0."
                    }
                  ]
                }
              ]
            },
            {
              "name": "sum",
              "label": "Sum",
              "description": "Adds data points together.",
              "properties": [
                {
                  "name": "align_end_time",
                  "label": "Align end time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The difference between align_start_time and align_end_time is that align_end_time sets the timestamp for the datapoint to the beginning of the following period versus the beginning of the current period. As with align_start_time, setting this to true will cause your data to take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_sampling",
                  "label": "Align sampling",
                  "description": "When set to true the time for the aggregated data point for each range will fall on the start of the range instead of being the value for the first data point within that range. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "true",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "align_start_time",
                  "label": "Align start time",
                  "description": "Setting this to true will cause the aggregation range to be aligned based on the sampling size. For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. Note that align_sampling, align_start_time, and align_end_time are mutually exclusive. If more than one are set, unexpected results will occur.",
                  "optional": false,
                  "type": "boolean",
                  "options": [],
                  "defaultValue": "false",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                },
                {
                  "name": "sampling",
                  "label": "Sampling",
                  "optional": false,
                  "type": "Object",
                  "multiline": false,
                  "properties": [
                    {
                      "name": "value",
                      "label": "Value",
                      "description": "The number of units for the aggregation buckets",
                      "optional": false,
                      "type": "long",
                      "options": [],
                      "defaultValue": "1",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": [
                        {
                          "expression": "value > 0",
                          "type": "js",
                          "message": "Value must be greater than 0."
                        }
                      ]
                    },
                    {
                      "name": "unit",
                      "label": "Unit",
                      "description": "The time unit for the sampling rate",
                      "optional": false,
                      "type": "enum",
                      "options": [
                        "MILLISECONDS",
                        "SECONDS",
                        "MINUTES",
                        "HOURS",
                        "DAYS",
                        "WEEKS",
                        "MONTHS",
                        "YEARS"
                      ],
                      "defaultValue": "MILLISECONDS",
                      "autocomplete": "",
                      "multiline": false,
                      "validations": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "trim",
              "label": "Trim",
              "description": "Trims off the first, last or both (first and last) data points from the results.",
              "properties": [
                {
                  "name": "trim",
                  "label": "Trim",
                  "description": "Which data point to trim",
                  "optional": false,
                  "type": "enum",
                  "options": [
                    "FIRST",
                    "LAST",
                    "BOTH"
                  ],
                  "defaultValue": "both",
                  "autocomplete": "",
                  "multiline": false,
                  "validations": []
                }
              ]
            }
          ]
        }
      ]`;

    return _.map(JSON.parse(FeatureTemplateDefinition), (o) => new FeatureTemplate(o));
}
