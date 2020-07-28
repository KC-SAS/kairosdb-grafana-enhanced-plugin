import _ from "lodash";

import { ParameterDeserializerFactory, ParameterTemplateFactory } from "./parameters/factory";
import { FeatureParameter, FeatureParameterTemplate, JsonFeatureParameter } from "./parameter";
import { KairosDBQueryCtrl } from "../../core/query_ctrl";
import { Template } from "./template";
import {KairosDBAnnotationsQueryCtrl} from "../../core/annotations_query_ctrl";
import {KairosDBQueryCtrlBase} from "../../core/query_ctrl_base";

/**
 * JSON model of the feature component template
 */
export interface JsonFeatureComponent {
    name: string;
    label: string;
    description: string;
    properties: JsonFeatureParameter[];
}

/**
 * Serialized model of query feature component.
 */
export interface SerializedFeatureComponent {
    name: string;
}

/**
 * Feature component model, representing a single KairosDB feature item.
 */
export class FeatureComponent {
    public name: string;
    public label: string;
    public parameters: FeatureParameter[];

    /**
     * Create a new FeatureComponent.
     * @param name          feature name
     * @param label         feature label
     * @param parameters    feature parameters
     */
    constructor(name: string, label: string, parameters: FeatureParameter[]) {
        this.name = name;
        this.label = label;
        this.parameters = parameters;
    }

    /**
     * Generate an object from the FeatureComponent and its parameters. It will
     * be used by the Feature.serialize() during query generation.
     */
    public serialize(): SerializedFeatureComponent {
        return this.parameters
            .map((parameter) => _.assign(ParameterDeserializerFactory.get(parameter).serialize(), parameter) as FeatureParameter)
            .reduce(
                (cur, val) => {
                    cur[val.name] = val.type === "object" ? val[val.name] : val.value;
                    return cur;
                },
                { name: this.name }
            );
    }
}

/**
 * Feature component template model, defining how a feature component must be
 * built from the Grafana query builder.
 */
export class FeatureComponentTemplate extends FeatureComponent implements Template {
    public description: string;

    /**
     * Create a new FeatureComponentTemplate.
     * @param json  json object containing the definition.
     */
    constructor(json: JsonFeatureComponent) {
        super(json.name, json.label, []);

        this.description = json.description;
        this.parameters = _.chain(json.properties)
            .map((o) => ParameterTemplateFactory.get(o.type)(o))
            .filter((o) => !_.isUndefined(o))
            .value();
    }

    /**
     * Generates an FeatureComponent from the current state of the template.
     */
    public extract(): FeatureComponent {
        return new FeatureComponent(this.name, this.label, _.map(this.parameters, (o) => (o as FeatureParameterTemplate).extract()));
    }

    /**
     * Refresh the template values
     * @param controler the controler instance
     */
    public refresh(controler: KairosDBQueryCtrlBase) {
        this.parameters.forEach((o) => (o as FeatureParameterTemplate).refresh(controler));
    }
}
