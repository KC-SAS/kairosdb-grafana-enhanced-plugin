import _ from "lodash";

import { FeatureParameter, FeatureParameterTemplate, JsonFeatureParameter, SerializedFeatureParameter } from "../parameter";
import { KairosDBQueryCtrl } from "../../../core/query_ctrl";
import { TemplatingUtils } from "../../../utils/templating_utils";
import {KairosDBAnnotationsQueryCtrl} from "../../../core/annotations_query_ctrl";
import {KairosDBQueryCtrlBase} from "../../../core/query_ctrl_base";

type ArraySource = (ctrl: KairosDBQueryCtrlBase) => string[];

export class ArrayParameter extends FeatureParameter {
    /**
     * Create a new ArrayParameter.
     * @param name  feature parameter name.
     * @param label feature parameter label.
     * @param type  feature parameter type.
     * @param value feature parameter value.
     */
    constructor(name: string, label: string, type: string, value: any) {
        super(name, label, type, value);
    }

    /**
     * Generate an object from the FeatureParameter and its childs. It will be used
     * by the FeatureComponent.serialize() during query generation.
     */
    public serialize(): SerializedFeatureParameter {
        return {
            [this.name]: _(this.value)
                .map((o) => TemplatingUtils.Singleton.replace(o))
                .flatten()
                .value(),
        };
    }
}

/**
 * FeatureParameterTemplate extended class for array typed parameter.
 */
export class ArrayParameterTemplate extends FeatureParameterTemplate {
    /**
     * List of available sources
     */
    private static availableSources = {
        tags: (ctrl: KairosDBQueryCtrlBase) => {
            const tags = [];

            if (ctrl.tags !== undefined) {
                for (const tag of Object.keys(ctrl.tags.tags)) {
                    tags.push(tag);
                }
            }
            return tags;
        },
        default: (ctrl: KairosDBQueryCtrl) => undefined,
    };

    /**
     * Values source name
     */
    public source: string;

    /**
     * List of possibles values.
     */
    public values: string[];

    /**
     * Create a new ArrayParameterTemplate.
     * @param json      json object containing the definition.
     * @param parent    parent node of the parameter.
     */
    constructor(json: JsonFeatureParameter, parent?: FeatureParameterTemplate) {
        super(json, "array", parent);

        this.value = json.defaultValue || [];
        this.source = json.autocomplete || "default";
    }

    /**
     * Generates an FeatureParameter from the current state of the template.
     */
    public extract(): FeatureParameter {
        return new ArrayParameter(this.name, this.label, this.type, this.value);
    }

    /**
     * Refresh the template values
     * @param controler the controler instance
     */
    public refresh(controler: KairosDBQueryCtrlBase) {
        const source: ArraySource =
            ArrayParameterTemplate.availableSources[this.source] || ArrayParameterTemplate.availableSources.default;
        this.values = source(controler);
    }
}
