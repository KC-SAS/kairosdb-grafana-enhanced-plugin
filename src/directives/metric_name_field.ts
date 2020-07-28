import _ from "lodash";

import {PromiseUtils} from "../utils/promise_utils";

export class MetricNameFieldCtrl {
    public value: string;
    public metricNames: string[];
    public numberOfMetricsFound: number;
    public showMetricFound: boolean = false;
    public alias: string;
    public segment: any;
    public aliasInputVisible: boolean = false;
    public aliasAddedVisible: boolean = false;
    private $q: any;
    private $scope: any;
    private promiseUtils: PromiseUtils;

    /** @ngInject **/
    constructor($scope, $q, private uiSegmentSrv) {
        this.$scope = $scope;
        this.$q = $q;
        this.uiSegmentSrv = uiSegmentSrv;
        this.promiseUtils = new PromiseUtils($q);
        this.segment = this.value ? uiSegmentSrv.newSegment(this.value) : uiSegmentSrv.newSelectMetric();
        this.aliasAddedVisible = !_.isNil(this.alias);
    }
    public onChange(): void {
        this.value = this.$scope.getMetricInputValue();
    }

    public suggestMetrics(): string[] {
        const query = (this.$scope.getMetricInputValue() as string).toLowerCase();
        this.numberOfMetricsFound = 0;
        const limitForDisplaying = 200;

        // In case of first click on the component, query is empty
        // We just need to transform metricNames to segment for metric-segment
        if (query === undefined || query.length === 0) {
            return this.promiseUtils.resolvedPromise(this.metricNames
                .map((metricName) => {
                    this.numberOfMetricsFound++;
                    return this.uiSegmentSrv.newSegment(metricName);
                }).slice(0, limitForDisplaying));
        }

        // In the case of query is not empty we need to apply filter and sort
        // This sort returns the best matches with first the metric names starting with the query and then in alphabetical order
        const metricNameLowerCase = this.metricNames.map((name, index) => ({ index, value: name.toLowerCase()}));
        return this.promiseUtils.resolvedPromise(
            [].concat(
                metricNameLowerCase.filter((metricName) =>
                    _.includes(metricName.value, query) && (metricName.value as string).startsWith(query))
                    .sort((a, b) => (a.value === query) ? -Infinity : a.value.localeCompare(b.value) ),
                metricNameLowerCase.filter((metricName) =>
                    _.includes(metricName.value, query) && !(metricName.value as string).startsWith(query))
                    .sort((a, b) => (a.value === query) ? -Infinity : a.value.localeCompare(b.value) )
            )
            .map((metricName) => {
                this.numberOfMetricsFound++;
                return this.uiSegmentSrv.newSegment(this.metricNames[metricName.index]);
            }).slice(0, limitForDisplaying));
    }

    public setAlias(alias): void {
        if (!_.isEmpty(alias)) {
            this.alias = alias;
            this.aliasAddedVisible = true;
        }
        this.aliasInputVisible = false;
    }
}

export class MetricNameFieldLink {
    constructor(scope, element, attrs, ctrl) {
        const input =  element[0].getElementsByTagName("input")[0];
        if (input.getAttribute("listener") !== "true") {
            input.setAttribute("listener",  "true");
            input.addEventListener("focusout", () => {
                ctrl.showMetricFound = false;
                ctrl.$scope.$apply();
            }, false);
            input.addEventListener("focusin", () => {
                ctrl.showMetricFound = true;
            }, false);
        }
        scope.getMetricInputValue = () => {
            return input.value;
        };
    }
}

export function MetricNameFieldDirective() {
    return {
        bindToController: true,
        controller: MetricNameFieldCtrl,
        controllerAs: "ctrl",
        link: MetricNameFieldLink,
        restrict: "E",
        scope: {
            alias: "=",
            metricNames: "=",
            value: "="
        },
        templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/metric.name.field.html"
    };
}
