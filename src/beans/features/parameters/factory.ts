import { ArrayParameter, ArrayParameterTemplate } from "./array";
import { BooleanParameter, BooleanParameterTemplate } from "./boolean";
import { EnumParameterTemplate } from "./enum";
import { FloatParameterTemplate, NumberParameter } from "./float";
import { IntegerParameterTemplate } from "./integer";
import { ObjectParameter, ObjectParameterTemplate } from "./object";
import { FeatureParameter, FeatureParameterTemplate, JsonFeatureParameter } from "../parameter";
import { StringParameterTemplate } from "./string";

export type ParameterTemplateBuilder = (
    json: JsonFeatureParameter,
    parent?: FeatureParameterTemplate
) => FeatureParameterTemplate;

export type ParameterDeserializer = (parameter: FeatureParameter) => FeatureParameter;

/**
 * Parameter factory used to create the right parameter from the specified type.
 */
export class ParameterTemplateFactory {
    /**
     * Returns the parameter template builder according to the type.
     * @param type parameter type
     */
    public static get(type: string): ParameterTemplateBuilder {
        type = type || "default";
        return ParameterTemplateFactory.builders[type.toLowerCase()] || ParameterTemplateFactory.builders.default;
    }

    /**
     * List of known parameter template builders.
     */
    private static builders = {
        boolean: ((json, parent) => new BooleanParameterTemplate(json, parent)) as ParameterTemplateBuilder,
        int: ((json, parent) => new IntegerParameterTemplate(json, parent)) as ParameterTemplateBuilder,
        long: ((json, parent) => new IntegerParameterTemplate(json, parent)) as ParameterTemplateBuilder,
        double: ((json, parent) => new FloatParameterTemplate(json, parent)) as ParameterTemplateBuilder,
        string: ((json, parent) => new StringParameterTemplate(json, parent)) as ParameterTemplateBuilder,
        enum: ((json, parent) => new EnumParameterTemplate(json, parent)) as ParameterTemplateBuilder,
        array: ((json, parent) => new ArrayParameterTemplate(json, parent)) as ParameterTemplateBuilder,
        object: ((json, parent) => new ObjectParameterTemplate(json, parent)) as ParameterTemplateBuilder,
        default: ((json) => console.error(`Unknown parameter type ${json.type} from ${json.label}`)) as ParameterTemplateBuilder,
    };
}

export class ParameterDeserializerFactory {
    /**
     * Returns the deserialized parameter, according to the type.
     * @param parameter parameter
     */
    public static get(parameter: FeatureParameter): FeatureParameter {
        const type = parameter.type || "default";
        const deserializer =
            ParameterDeserializerFactory.deserializers[type.toLowerCase()] ||
            ParameterDeserializerFactory.deserializers.default;
        return deserializer(parameter);
    }

    /**
     * List of known parameter template builders.
     */
    private static deserializers = {
        bool: ((parameter) => Object.assign(BooleanParameter.prototype, parameter)) as ParameterDeserializer,
        number: ((parameter) => Object.assign(NumberParameter.prototype, parameter)) as ParameterDeserializer,
        array: ((parameter) => Object.assign(ArrayParameter.prototype, parameter)) as ParameterDeserializer,
        object: ((parameter) => Object.assign(ObjectParameter.prototype, parameter)) as ParameterDeserializer,
        default: ((parameter) => Object.assign(FeatureParameter.prototype, parameter)) as ParameterDeserializer,
    };
}
