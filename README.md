
Description
===========

This plugin gives access to a new data source called `KairosDB`.

It allows you to build queries for `KairosDB`.
A query is the operation that fetches data from the database, executes some processing (aggregation,..), and returns the result in the form of time series. 

For more information about queries and Grafana please refer to the official Grafana documentation.

KairosDB and Kratos data platform
=================================

KairosDB is the base source code used by `Kratos` for the `Kratos data platform`.
Kratos data platform extends the KairosDB backend and the Grafana datasource plugin to provide additional features.

[![image](./src/img/kairosdb_logo.png)](https://kairosdb.github.io/)[![image](./src/img/skyminer_logo.png)](https://www.kratosdefense.com/)

| Features                | KairosDB    | Kratos data platform | Description                                                                                        |
| ----------------------- | ----------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| Time override           | No          | Yes                  | Specifies a different time range for each metric in the query                                      |
| Fetch previous sample   | No          | Yes                  | Returns the previous sample value of the series it is applied on (older than dashboard start time) |
| Safeguard               | No          | Yes                  | Limits the number of points returned by Kratos data platform                                       |
| Group By                | Yes         | Yes                  | KairosDB base feature                                                                              |
| Aggregator              | Yes         | Yes                  | KairosDB base feature, additional aggregators are provided by Kratos data platform                 |
| Vertical Aggregator     | No          | Yes                  | Aggregates the datapoints of the different series together                                         |
| Predictor               | No          | Yes                  | Returns a time series that represents the future of the series it is applied on                    |
| Outlier detection       | No          | Yes                  | Returns a time series that represents the anomalies of the series it is applied on                 |
