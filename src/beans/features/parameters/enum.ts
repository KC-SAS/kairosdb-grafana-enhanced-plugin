import _ from "lodash";

import { FeatureParameterTemplate, JsonFeatureParameter } from "../parameter";

/**
 * FeatureParameterTemplate extended class for enum typed parameter.
 */
export class EnumParameterTemplate extends FeatureParameterTemplate {
    /**
     * List of all enumeration
     */
    public values: string[];

    /**
     * Create a new EnumParameterTemplate.
     * @param json      json object containing the definition.
     * @param parent    parent node of the parameter.
     */
    constructor(json: JsonFeatureParameter, parent?: FeatureParameterTemplate) {
        super(json, "enum", parent);

        // tslint:disable-next-line:curly
        if (!_.isArray(json.options) || json.options.length === 0) return;

        this.values = json.options;
        json.defaultValue = json.defaultValue || this.values[0];
        this.value = _.find(this.values, (o) => o.toLowerCase() === json.defaultValue.toLowerCase()) || this.values[0];
    }

    /**
     * Formats all enumerations values to human readable string (without underscore and in lower case).
     */
    public formatOptions(): string[] {
        return _.map(this.values, (o) => o.replace(/_/gi, " ").toLowerCase());
    }
}
