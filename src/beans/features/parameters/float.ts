import { FeatureParameter, FeatureParameterTemplate, JsonFeatureParameter, SerializedFeatureParameter } from "../parameter";
import { TemplatingUtils } from "../../../utils/templating_utils";
import { FeatureValidation } from "../validation";

export class NumberParameter extends FeatureParameter {
    /**
     * Generate an object from the FeatureParameter and its childs. It will be used
     * by the FeatureComponent.serialize() during query generation.
     */
    public serialize(): SerializedFeatureParameter {
        return { [this.name]: Number(TemplatingUtils.Singleton.replace(this.value)[0]) };
    }
}

/**
 * FeatureParameterTemplate extended class for float typed parameter.
 */
export class FloatParameterTemplate extends FeatureParameterTemplate {
    /**
     * Create a new FloatParameterTemplate.
     * @param json      json object containing the definition.
     * @param parent    parent node of the parameter.
     */
    constructor(json: JsonFeatureParameter, parent?: FeatureParameterTemplate) {
        super(json, "number", parent);

        this.value = json.defaultValue || 0.0;
        this.validations.unshift(
            new FeatureValidation({
                type: "js",
                expression: "!Number.isNaN(+value) && Number.isFinite(value)",
                message: "Value must be a number",
            })
        );
    }

    /**
     * Generates a FeatureParameter from the internal current of the template.
     */
    public extract(): FeatureParameter {
        return new NumberParameter(this.name, this.label, this.type, this.value);
    }

    /**
     * Check if the value respects constraint.
     * @param value value to be checked.
     */
    public validate(value: any = TemplatingUtils.Singleton.replace(this.value)[0]): string {
        return super.validate(Number.isNaN(+value) ? `'${value}'` : value);
    }
}
