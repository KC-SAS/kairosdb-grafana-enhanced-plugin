import _ from "lodash";

import { FeatureComponent, FeatureComponentTemplate, JsonFeatureComponent, SerializedFeatureComponent } from "./component";
import { KairosDBQueryCtrl } from "../../core/query_ctrl";
import { Template } from "./template";
import {KairosDBAnnotationsQueryCtrl} from "../../core/annotations_query_ctrl";
import {KairosDBQueryCtrlBase} from "../../core/query_ctrl_base";

/**
 * JSON model of the feature template.
 */
export interface JsonFeature {
    name: string;
    label: string;
    properties: JsonFeatureComponent[];
}

/**
 * Serialized model of query feature.
 */
export interface SerializedFeature {
    [key: string]: SerializedFeatureComponent[];
}

/**
 * Feature model, representing a feature category (like aggregators).
 */
export class Feature {
    public name: string;
    public components: FeatureComponent[] = [];

    /**
     * Create a new Feature.
     * @param name feature name
     */
    constructor(name: string) {
        this.name = name;
    }

    /**
     * Generate an object from the Feature and its components. It will
     * be used during query generation.
     */
    public serialize(): any {
        return {
            [this.name]: _.map(this.components, (o) =>
                (Object.assign(FeatureComponent.prototype, o) as FeatureComponent).serialize()
            ),
        };
    }
}

/**
 * Feature template model, defining how a feature must be built from
 * the Grafana query builder.
 */
export class FeatureTemplate extends Feature implements Template {
    public label: string;

    /**
     * Create a new FeatureTemplate.
     * @param json  json object containing the definition.
     */
    constructor(json: JsonFeature) {
        super(json.name);

        this.label = json.label;
        this.components = _.map(json.properties, (o) => new FeatureComponentTemplate(o));
    }

    /**
     * Refresh the template values
     * @param controler the controler instance
     */
    public refresh(controler: KairosDBQueryCtrlBase) {
        this.components.forEach((o) => (o as FeatureComponentTemplate).refresh(controler));
    }
}
