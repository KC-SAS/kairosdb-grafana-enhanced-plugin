import _ from "lodash";

import { ParameterDeserializerFactory, ParameterTemplateFactory } from "./factory";
import { FeatureParameter, FeatureParameterTemplate, JsonFeatureParameter, SerializedFeatureParameter } from "../parameter";

/**
 * FeatureParameter extended class containing child parameters.
 */
export class ObjectParameter extends FeatureParameter {
    /**
     * List of child parameters.
     */
    public parameters: FeatureParameter[] = [];

    /**
     * Create a new ObjectParameter.
     * @param name          name of the ObjectParameter, used in the query.
     * @param parameters    list of child FeatureParameter.
     */
    constructor(name: string, parameters: FeatureParameter[]) {
        super(name, "", "object", null);
        this.parameters = parameters;
    }

    /**
     * Generate an object from the ObjectParameter and its childs. It will be used
     * by the FeatureComponent.serialize() during query generation.
     */
    public serialize(): SerializedFeatureParameter {
        return {
            [this.name]: _
                .chain(this.parameters)
                .map((o) => ParameterDeserializerFactory.get(o).serialize())
                .reduce((r, v) => _.assign(r, v), {})
                .value(),
        };
    }
}

/**
 * FeatureParameterTemplate extended class for object typed parameter.
 */
export class ObjectParameterTemplate extends FeatureParameterTemplate {
    public parameters: FeatureParameterTemplate[] = [];

    /**
     * Create a new ObjectParameterTemplate.
     * @param json      json object containing the definition.
     * @param parent    parent node of the parameter.
     */
    constructor(json: JsonFeatureParameter, parent?: FeatureParameterTemplate) {
        super(json, "object", parent);

        this.parameters = _
            .chain(json.properties)
            .map((o) => ParameterTemplateFactory.get(o.type)(o, this))
            .filter((o) => !_.isUndefined(o))
            .value();
    }

    /**
     * Generates an ObjectParameter from the current state of the template.
     */
    public extract(): FeatureParameter {
        return new ObjectParameter(this.name, _.map(this.parameters, (o) => o.extract()));
    }
}
