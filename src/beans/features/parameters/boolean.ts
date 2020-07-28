import { FeatureParameter, FeatureParameterTemplate, JsonFeatureParameter, SerializedFeatureParameter } from "../parameter";
import { TemplatingUtils } from "../../../utils/templating_utils";

export class BooleanParameter extends FeatureParameter {
    /**
     * Generate an object from the FeatureParameter and its childs. It will be used
     * by the FeatureComponent.serialize() during query generation.
     */
    public serialize(): SerializedFeatureParameter {
        return { [this.name]: Boolean(TemplatingUtils.Singleton.replace(this.value)[0]) };
    }
}

/**
 * FeatureParameterTemplate extended class for boolean typed parameter.
 */
export class BooleanParameterTemplate extends FeatureParameterTemplate {
    /**
     * Create a new BooleanParameterTemplate.
     * @param json      json object containing the definition.
     * @param parent    parent node of the parameter.
     */
    constructor(json: JsonFeatureParameter, parent?: FeatureParameterTemplate) {
        super(json, "bool", parent);

        this.value = json.defaultValue === true || json.defaultValue === "true";
    }

    /**
     * Generates an FeatureParameter from the current state of the template.
     */
    public extract(): FeatureParameter {
        return new BooleanParameter(this.name, this.label, this.type, this.value);
    }
}
