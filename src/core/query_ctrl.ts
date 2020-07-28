
import { QueryCtrl } from "app/plugins/sdk";
import "../directives/metric_name_field";
import "../css/plugin.css!";
import "../directives/tags_select";
import {KairosDBQueryCtrlBase, KairosDBQueryCtrlBaseInterface} from "./query_ctrl_base";
import {TargetValidator} from "./request/target_validator";
import {MetricTags} from "../beans/request/metric_tags";
import {KairosDBTarget} from "../beans/request/target";
import {KairosDBDatasource} from "./datasource";

export const KAIROS_DB_QUERY_CTRL_NAME = "KairosDBQueryCtrl";

/**
 * Metric query controller extended from the Grafana one.
 * Mixins are applied here to "inherit" from our query controller base class KairosDBQueryCtrlBase as multi
 * inheritance does not exist in typescript except for interfaces
 */
export class KairosDBQueryCtrl extends QueryCtrl implements KairosDBQueryCtrlBaseInterface {
    public static templateUrl = "partials/query.editor.html";

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
     * Scope from AngularJS
     */
    public $scope: any;

    /**
     * Property used to display the auto sync toggle that shall only be visible in the metric query row
     * (so hidden in the annotations query)
     */
    public showQueryAutoSync: boolean;

    /**
     * Declaration of the construct method of the base class KairosDBQueryCtrlBase that is injected
     * by mixins (pseudo-inheritance)
     */
    public construct: ($scope) => void;

    /** @ngInject **/
    constructor($scope, $injector) {
        // Calling the QueryCtrl constructor
        super($scope, $injector);

        /** Here lies the magic
         * We are injecting classes properties and method except the constructor
         * @param derivedCtor
         * @param baseCtors
         */
        function applyMixins(derivedCtor: any, baseCtors: any[]) {
            baseCtors.forEach((baseCtor) => {
                Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                    if (name !== "constructor") {
                        Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
                    }
                });
            });
        }
        // Applying the KairosDBQueryCtrlBase properties and methods to the KairosDBQueryCtrl class
        applyMixins(KairosDBQueryCtrl, [KairosDBQueryCtrlBase]);

        // Setting controller name for the fetch_previous_sample hack
        this.queryCtrlName = KAIROS_DB_QUERY_CTRL_NAME;

        // Calling the KairosDBQueryCtrlBase pseud-constructor
        this.construct($scope);

        // Hacking (again) to display the autosync toggle in the metric query row
        this.showQueryAutoSync = true;
    }
}
