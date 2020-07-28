import {KairosDBQueryCtrlBase} from "./query_ctrl_base";

export const KAIROS_DB_ANNOTATIONS_QUERY_CTRL_NAME = "KairosDBQueryCtrl";

export class KairosDBAnnotationsQueryCtrl extends KairosDBQueryCtrlBase {
    public static templateUrl = "partials/annotations.editor.html";

    /**
     * Annotation object that will be injected in the options before calling annotationQuery method
     * of the KairosDBDatasource
     */
    public annotation: any;

    /**
     * Local target to be used by the html template.
     * Declared and used as the annotations.editor uses exactly the same partials than the KairosDBQueryCtrl.
     * This is an hack to behave exactly like the metric query editor and using the same objects and targets
     */
    public target: any;

    constructor($scope, $injector) {
        super($scope, $injector);
        this.queryCtrlName = KAIROS_DB_ANNOTATIONS_QUERY_CTRL_NAME;

        if (this.annotation.target) {
            // Re initialises the base class target using the one injected
            // (when an annotations request is already defined)
            this.target = this.annotation.target;
            this.construct($scope);
        }

        // Initialises the options-injected annotations query object to be updated directly
        // by the partials using object reference
        this.annotation.target = this.target;
    }
}
