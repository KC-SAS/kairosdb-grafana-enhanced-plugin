import { FloatParameterTemplate } from "./float";
import { FeatureParameterTemplate, JsonFeatureParameter } from "../parameter";
import { FeatureValidation } from "../validation";

/**
 * FeatureParameterTemplate extended class for integer typed parameter.
 */
export class IntegerParameterTemplate extends FloatParameterTemplate {
    /**
     * Create a new IntegerParameterTemplate.
     * @param json      json object containing the definition.
     * @param parent    parent node of the parameter.
     */
    constructor(json: JsonFeatureParameter, parent?: FeatureParameterTemplate) {
        super(json, parent);

        this.value = json.defaultValue || 0;
        this.validations[0] = new FeatureValidation({
            type: "js",
            expression: "!Number.isNaN(value) && Number.isFinite(value) && Number.isInteger(value)",
            message: "Value must be an integer",
        });
    }
}
