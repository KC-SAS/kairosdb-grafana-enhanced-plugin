/**
 * JSON model of the feature validation.
 */
export interface JsonFeatureValidation {
    expression: string;
    message: string;
    type: string;
}

/**
 * Feature validation model, use to validate a parameter value
 * from the Grafana query builder.
 */
export class FeatureValidation {
    public message: string;
    private expression: string;
    private type: string;

    /**
     * Create a new FeatureValidation.
     * @param json  json object containing the definition.
     */
    constructor(json: JsonFeatureValidation) {
        this.expression = json.expression;
        this.type = json.type;
        this.message = json.message;
    }

    /**
     * Check if the value respects constraint.
     * @param value value to be checked.
     */
    public validate(value: any): boolean {
        if (this.type.toLowerCase() !== "js") {
            return true; // ignore if expression is not JS
        }

        try {
            // tslint:disable-next-line:no-eval
            return eval(`((value) => ${this.expression})(${value})`);
        } catch (e) {
            // validation is here only to help user during query building. Validation
            // DO NOT block any query building, that why it return `true` if failed.
            return true;
        }
    }
}
