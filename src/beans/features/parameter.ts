import _ from "lodash";

import { KairosDBQueryCtrl } from "../../core/query_ctrl";
import { Template } from "./template";
import { TemplatingUtils } from "../../utils/templating_utils";
import { FeatureValidation, JsonFeatureValidation } from "./validation";
import {KairosDBAnnotationsQueryCtrl} from "../../core/annotations_query_ctrl";
import {KairosDBQueryCtrlBase} from "../../core/query_ctrl_base";

/**
 * JSON model of the feature parameter template.
 */
export interface JsonFeatureParameter {
    name: string;
    label: string;
    description?: string;
    optional: boolean;
    type: string;
    options?: string[];
    defaultValue?: any;
    autocomplete?: string;
    multiline: boolean;
    validations?: JsonFeatureValidation[];
    properties?: JsonFeatureParameter[];
}

/**
 * Serialized model of query feature parameter.
 */
export interface SerializedFeatureParameter {
    [name: string]: any;
}

/**
 * Feature parameter model.
 */
export class FeatureParameter {
    public name: string;
    public type: string;
    public value: any;
    public _label: string;

    /**
     * Create a new FeatureParameter.
     * @param name  feature parameter name.
     * @param label feature parameter label.
     * @param type  feature parameter type.
     * @param value feature parameter value.
     */
    constructor(name: string, label: string, type: string, value: any) {
        this.name = name;
        this.type = type;
        this._label = label;
        this.value = value;
    }

    /**
     * Label getter.
     */
    get label(): string {
        return this._label;
    }

    /**
     * Generate an object from the FeatureParameter and its childs. It will be used
     * by the FeatureComponent.serialize() during query generation.
     */
    public serialize(): SerializedFeatureParameter {
        return { [this.name]: TemplatingUtils.Singleton.replace(this.value)[0] };
    }
}

/**
 * Feature parameter template model, defining how a feature component paramter must
 * be built from the Grafana query builder.
 */
export abstract class FeatureParameterTemplate extends FeatureParameter implements Template {
    public description: string;
    public optional: boolean;
    public validations: FeatureValidation[] = [];

    private parent: FeatureParameterTemplate;

    /**
     * Create a new FeatureParameterTemplate.
     * @param json      json object containing the definition.
     * @param type      parameter type.
     * @param parent    parent node of the parameter.
     */
    constructor(json: JsonFeatureParameter, type: string, parent?: FeatureParameterTemplate) {
        super(json.name, json.label, type, undefined);

        this.description = json.description;
        this.optional = json.optional;
        this.parent = parent;
        this.validations = _.map(json.validations, (o) => new FeatureValidation(o));
    }

    /**
     * Label getter overriding. If a parent was defined, the label use
     * the parent label to generate it.
     */
    get label(): string {
        return this.parent === undefined ? this._label : this.parent.label + " " + this._label;
    }

    /**
     * Generates an FeatureParameter from the current state of the template.
     */
    public extract(): FeatureParameter {
        return new FeatureParameter(this.name, this.label, this.type, this.value);
    }

    /**
     * Check if the value respects constraint.
     * @param value value to be checked.
     * @returns an error message if the value is invalid, otherwise undefined
     */
    public validate(value: any = TemplatingUtils.Singleton.replace(this.value)[0]): string {
        const invalid = _.find(this.validations, (o) => !o.validate(value));
        if (invalid) {
            return invalid.message;
        }
    }

    /**
     * Refresh the template values
     * @param controler the controler instance
     */
    public refresh(controler: KairosDBQueryCtrlBase) {
        return;
    }
}
