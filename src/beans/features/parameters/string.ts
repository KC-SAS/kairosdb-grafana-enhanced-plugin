import { FeatureParameterTemplate, JsonFeatureParameter } from "../parameter";

/**
 * FeatureParameterTemplate extended class for string typed parameter
 */
export class StringParameterTemplate extends FeatureParameterTemplate {
    public multiline: boolean;

    /**
     * The parameter template constructor.
     * @param json      json object containing the definition.
     * @param parent    parent node of the parameter.
     */
    constructor(json: JsonFeatureParameter, parent?: FeatureParameterTemplate) {
        super(json, "string", parent);

        this.multiline = json.multiline;
        this.value = json.defaultValue || "";
    }

    /**
     * Check if the value respects constraint.
     * @param value value to be checked.
     */
    public validate(value: any = this.value): string {
        return super.validate(`'${value}'`);
    }
}
