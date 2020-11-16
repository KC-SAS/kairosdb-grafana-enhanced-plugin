import {Feature, FeatureTemplate} from "../beans/features/feature";
import {TargetValidator} from "./request/target_validator";
import {MetricTags} from "../beans/request/metric_tags";
import {SafeGuard} from "../beans/features/safeguard";
import {FetchPreviousSample} from "../beans/features/fetch_previous_sample";
import {LegacyFeatures} from "../beans/features/legacy_features";
import appEvents from "app/core/app_events";
import {KairosDBTarget} from "../beans/request/target";
import {TIME_UNITS} from "../utils/time_utils";
import _ from "lodash";
import {KairosDBDatasource} from "./datasource";

export interface KairosDBQueryCtrlBaseInterface {
    queryCtrlName: string;
    features: FeatureTemplate[];
    tagsInitializationError: string;
    targetValidator: TargetValidator;
    tags: MetricTags;
    expandSafeguard: boolean;
    safeGuard: SafeGuard;
    isLastQuery: boolean;
    isMetricNameTemplateVariable: boolean;
    templateVariables: string[];
    enabledTimeOverride: boolean;
    enabledFetchPreviousSamples: boolean;
    filters: any;
    timeOverrideError: string;
    fetch_previous_sample: FetchPreviousSample;
}

export const DEFAULT_SAFEGUARD = {
    group_limit: 30,
    before_aggregation: 5000000,
    after_aggregation: 10000,
    limit: 0
} as SafeGuard;

/**
 * KairosDB query control base class inherited for metrics and annotations queries
 */
export class KairosDBQueryCtrlBase implements KairosDBQueryCtrlBaseInterface {
    /** Interface implementation */
    public queryCtrlName = "";
    public features = undefined;
    public tagsInitializationError = undefined;
    public targetValidator = new TargetValidator();
    public tags = new MetricTags();
    public expandSafeguard = false;
    public safeGuard = undefined;
    public isLastQuery = false;
    public isMetricNameTemplateVariable = false;
    public templateVariables = [];
    public enabledTimeOverride = false;
    public enabledFetchPreviousSamples = false;
    public filters = [];
    public timeOverrideError = "";
    public fetch_previous_sample = null;

    /**
     * Scope from AngularJS (forward declaration)
     */
    public $scope = {
        $root: {},
        $apply: () => {}
    };

    /**
     * Target from Grafana (forward declaration)
     */
    public target = {
        query: new KairosDBTarget(),
        autoSync: false,
        safeGuard: undefined,
        fetch_previous_sample: undefined,
        filters: []
    };

    /**
     * Datasource from Grafana (forward declaration)
     */
    public datasource: any;

    constructor($scope, $injector) {
        this.construct($scope);
    }

    /**
     * Contructs the base class. SHALL BE CALLED EXPLICITLY IF "INHERITED" BY MIXINS
     * @param $scope AngularJS scope (passed by injection)
     */
    public construct($scope) {
        this.$scope = $scope;

        this.datasource.initialize();
        $scope.$watch("ctrl.target.query", this.onTargetChange.bind(this), true);
        $scope.$watch("ctrl.target.query.metricName", this.onMetricNameChanged.bind(this));

        this.datasource
            .getFeatures()
            .then((features) => (this.features = features), () => (this.features = LegacyFeatures()))
            .then(() => {
                this.refreshTemplate();
                this.$scope.$apply();
            });

        this.initialize();
        this.isMetricNameTemplateVariable = this.datasource.isTemplateVariable(this.target.query.metricName);
        this.templateVariables = this.datasource.getTemplateVariables();

        this.filters = this.target.filters || [];

        if (this.isLastQuery) {
            appEvents.emit("alert-success", [
                "Note: It is recommended to check that auto-refresh is disabled when editing your dashboard",
                ""
            ]);
        }
    }

    /**
     * Extracts all the controllers with the same than the current query controller
     * This is an hack to propagate the settings to all the query metric row controllers
     * @param root
     */
    public getControllers(root) {
        const controllers = {};

        function visit(scope, ctrlName) {
            if (scope.ctrl &&
                scope.ctrl.datasource &&
                scope.ctrl.target &&
                scope.ctrl.queryCtrlName === ctrlName) {
                controllers[scope.ctrl.target.refId] = scope.ctrl;
            }
        }
        function traverse(scope, ctrlName) {
            visit(scope, ctrlName);
            if (scope.$$nextSibling) {
                traverse(scope.$$nextSibling, ctrlName);
            }
            if (scope.$$childHead) {
                traverse(scope.$$childHead, ctrlName);
            }
        }

        traverse(root, this.queryCtrlName);
        return controllers;
    }

    public getCollapsedText(): string {
        if (this.target.query.metricName === undefined) {
            return "Select a metric";
        }

        const alias = this.target.query.alias ? ` as ${this.target.query.alias}` : "";
        const queryFlow = _(this.target.query.features as Feature[])
            .filter((o) => !_.isEmpty(o.components))
            .map(
                (o) =>
                    `(${_(o.components)
                        .map((x) => x.name)
                        .join(" > ")})`
            )
            .join(" > ");
        return `${this.target.query.metricName}${alias} { ${queryFlow} }`;
    }

    /**
     * Initializes the controller
     * @param metricName
     * @param force Set to true it forces the initialisation of an empty target
     */
    public initialize(metricName?: string, force: boolean = false) {
        this.target.query = force ? new KairosDBTarget() : this.target.query || new KairosDBTarget();
        this.target.query.metricName = force ? metricName : this.target.query.metricName;
        this.target.autoSync = this.target.autoSync === undefined ? false : this.target.autoSync;

        if (this.datasource.type !== "grafana-skyminer-datasource") {
            delete this.target.safeGuard;
            delete this.target.fetch_previous_sample;
        } else {
            this.target.safeGuard = this.target.safeGuard !== undefined ? this.target.safeGuard :
                DEFAULT_SAFEGUARD;

            this.expandSafeguard = !_.isEqual(this.target.safeGuard, DEFAULT_SAFEGUARD);
            this.enabledTimeOverride = !!this.target.query.time_offset;
            this.enabledFetchPreviousSamples = !!this.target.fetch_previous_sample;

            this.updateFetchPreviousSample();
            this.updateSafeGuard();
        }

        if (this.target.query.features.length === 0) {
            this.target.query.features = _.map(this.features, (o) => new Feature(o.name));
        }

        if (!this.isMetricNameTemplateVariable) {
            this.initializeTags(this.target.query.metricName);
        }
    }

    /**
     * Updates all the controllers fetch_previous_sample field of the targets
     */
    public updateFetchPreviousSample() {
        const controllers = this.getControllers(this.$scope.$root);
        Object.keys(controllers).forEach( (key) => {
            const controller = controllers[key];
            controller.target.fetch_previous_sample = this.target.fetch_previous_sample;
            controller.enabledFetchPreviousSamples = this.enabledFetchPreviousSamples;
        });
    }

    /**
     * Updates all the controllers safeguard field of the targets
     */
    public updateSafeGuard() {
        const controllers = this.getControllers(this.$scope.$root);
        Object.keys(controllers).forEach( (key) => {
            const controller = controllers[key];
            if (this.expandSafeguard) {
                controller.target.safeGuard = this.target.safeGuard;
                controller.expandSafeguard = this.expandSafeguard;
            }
        });
    }

    public initializeTags(metricName: string) {
        this.clear();
        if (metricName) {
            this.tags = new MetricTags();
            this.datasource
                .getMetricTags(metricName)
                .then((tags) => this.tags.updateTags(tags), (error) => (this.tagsInitializationError = error.data.message))
                .then(() => {
                    this.refreshTemplate();
                    this.$scope.$apply();
                });
        }
    }

    public loadMetricNames() {
        this.datasource.fetchMetricNames();
    }

    public refreshTemplate() {
        if (this.features !== undefined) {
            this.features.forEach((t) => t.refresh(this));
        }
    }

    public onTargetChange(newTarget, oldTarget) {
        if (
            this.isTargetChanged(newTarget, oldTarget) &&
            this.targetValidator.isValidTarget(newTarget)
        ) {
            this.validateTimeOverride();

            if (this.target.autoSync) {
                this.refresh();
            }
        }
    }

    public validateTimeOverride() {
        this.timeOverrideError = "";

        if (this.enabledTimeOverride && this.target.query.time_offset.value === null) {
            this.timeOverrideError = "You must define an offset for time override feature";
        }
    }

    public onMetricNameChanged(newMetricName: string, oldMetricName: string) {
        if (this.isMetricNameChanged(newMetricName, oldMetricName)) {
            this.isMetricNameTemplateVariable = this.datasource.isTemplateVariable(newMetricName);
            this.initialize(newMetricName);
            this.clearTagFiltersAfterMetricNameChanged();
        }
    }

    public clearTagFiltersAfterMetricNameChanged() {
        this.target.query.tags = {};
    }

    public showFeatures(): boolean {
        return this.target.query.metricName && this.target.query.features.length > 0;
    }

    public isMetricNameChanged(_new: string, _old: string): boolean {
        return _new !== _old;
    }

    public isTargetChanged(_new: any, _old: any): boolean {
        return JSON.stringify(_new) !== JSON.stringify(_old);
    }

    public toggleAutoSync() {
        this.target.autoSync = !this.target.autoSync;
        this.refresh();
    }

    public toggleSafeguard() {
        this.expandSafeguard = !this.expandSafeguard;
        this.updateSafeGuard();
    }

    public toggleTimeoverride() {
        this.enabledTimeOverride = !this.enabledTimeOverride;
        this.target.query.time_offset = this.enabledTimeOverride ? {
            value: 1, unit: "hours"
        } : null;
    }

    public toggleFetchprevioussample() {
        this.enabledFetchPreviousSamples = !this.enabledFetchPreviousSamples;
        this.target.fetch_previous_sample = this.enabledFetchPreviousSamples ? {
            merge_groups: true,
            time_align: true,
            for_empty_results_only: false
        } : null;

        this.updateFetchPreviousSample();
    }

    public toggleFetchprevioussampleMergegroups() {
        this.target.fetch_previous_sample.merge_groups = !this.target.fetch_previous_sample.merge_groups;

        this.updateFetchPreviousSample();
    }

    public toggleFetchprevioussampleTimealign() {
        this.target.fetch_previous_sample.time_align = !this.target.fetch_previous_sample.time_align;

        this.updateFetchPreviousSample();
    }

    public toggleFetchprevioussampleForemptyresultsonly() {
        this.target.fetch_previous_sample.for_empty_results_only = !this.target.fetch_previous_sample.for_empty_results_only;

        this.updateFetchPreviousSample();
    }

    public addFilter() {
        this.filters.push({
            name: "",
            values: [],
            showInput: true
        });
    }

    public onKeyPressFilter(event: any, index: number) {
        // If key pressed is enter (code 13)
        if (event.which === 13) {
            this.filters[index].showInput = false;
            if (this.filters[index].values.length) {
                this.refreshTargetFilters();
            }
        }
    }

    public onKeyPressValues(event: any, index: number, target) {
        // If key pressed is enter (code 13)
        if (event.which === 13) {
            if (this.filters[index].values.indexOf(target.value) === -1 && target.value) {
                this.filters[index].values.push(target.value);
                this.refreshTargetFilters();
            }
            // reset input
            target.value = "";
        }
    }

    public onFocusOutFilterInput(index: number) {
        this.filters[index].showInput = false;
        if (this.filters[index].values.length) {
            this.refreshTargetFilters();
        }
    }

    public showInput(index: number) {
        this.filters[index].showInput = true;
    }

    public removeFilter(index: number) {
        this.filters.splice(index, 1);
        this.refreshTargetFilters();
    }

    public removeFilterValue(filterIndex: number, filterValueIndex: number) {
        this.filters[filterIndex].values.splice(filterValueIndex, 1);
        this.refreshTargetFilters();
    }

    public refreshTargetFilters() {
        this.target.filters = this.filters;
        this.refresh();
    }

    public clear(): void {
        this.tagsInitializationError = undefined;
    }

    public timeUnitOptions() {
        return TIME_UNITS;
    }

    /**
     * Dummy implementation to be overridden in the children classes (inherited by extension and mixins)
     */
    public refresh() {
        const dummy = "";
    }
}
