import _ from "lodash";

import { FeatureComponent, FeatureComponentTemplate } from "../beans/features/component";
import { Feature, FeatureTemplate } from "../beans/features/feature";
import {FeatureParameter, FeatureParameterTemplate} from "../beans/features/parameter";
import {ObjectParameter, ObjectParameterTemplate} from "../beans/features/parameters/object";

export class FeatureCtrl {
    public template: FeatureTemplate;
    public feature: Feature;
    public variables: string[];
    public chosenIndex: any;
    public showOptional = false;
    private $scope: any;

    /** @ngInject **/
    public constructor($scope) {
        this.$scope = $scope;
    }

    public isThereOptionalParameters(component: FeatureComponentTemplate) {
        if (component) {
            return component.parameters.reduce((accumulator: boolean, current: FeatureParameterTemplate) => {
                return current.optional || accumulator;
            }, false);
        }
        return false;
    }

    public pick(component: FeatureComponentTemplate, position = -1) {
        const pickedComponent = _.cloneDeep(component);
        if (pickedComponent) {
            if (this.feature.name === "group_by" && pickedComponent.name === "tag") {
                pickedComponent.parameters[0].values = [...pickedComponent.parameters[0].values, ...this.variables];
            }
            pickedComponent.position = position;
            this.$scope.pickedComponent = pickedComponent;
        }
        this.showOptional = false;
    }

    public commit(component: FeatureComponentTemplate, position = -1) {
        if (this.isThereOptionalParameters(component) && !this.showOptional) {
            component.parameters = component.parameters.reduce((accumulator, current: FeatureParameterTemplate) => {
                if (!current.optional) {
                    accumulator.push(current);
                }
                return accumulator;
            }, []);
        }

        if (position === -1) {
            this.feature.components.push(component.extract());
        } else {
            this.feature.components.splice(position, 0, component.extract());
        }
        this.clear();
    }

    public remove(component: FeatureComponent) {
        _.remove(this.feature.components, (o) => o === component);
    }

    public edit(component: FeatureComponent) {
        const position = _.findIndex(this.feature.components, (comp) => {
            return _.isEqual(comp, component);
        });
        this.remove(component);

        const compTemplate = _.find(this.template.components, {
            name: component.name,
        }) as FeatureComponentTemplate;

        component.parameters.forEach((actualParam) => {
            const templateParam = _.find(compTemplate.parameters, {
                name: actualParam.name,
            });

            this.patchParameterTemplateValues(templateParam as ObjectParameterTemplate, actualParam as ObjectParameter);
        });

        this.chosenIndex = this.template.components.indexOf(_.find(this.template.components, {
            name: component.name,
        })).toString();

        this.pick(compTemplate, position);
    }

    public moveUp(component: FeatureComponent) {
        const position = _.findIndex(this.feature.components, (comp) => {
            return _.isEqual(comp, component);
        });

        if (position > 0) {
            const temp = this.feature.components[position - 1];
            this.feature.components[position - 1] = component;
            this.feature.components[position] = temp;
        }
    }

    public moveDown(component: FeatureComponent) {
        const position = _.findIndex(this.feature.components, (comp) => {
            return _.isEqual(comp, component);
        });

        if (position < this.feature.components.length - 1) {
            const temp = this.feature.components[position + 1];
            this.feature.components[position + 1] = component;
            this.feature.components[position] = temp;
        }
    }

    public clear() {
        this.$scope.pickedComponent = null;
        this.chosenIndex = "";
        this.showOptional = false;
    }

    private patchParameterTemplateValues(templateParameter: ObjectParameterTemplate,
                                         actualParameter: ObjectParameter) {
        if (actualParameter.parameters && actualParameter.parameters.length > 0) {
            actualParameter.parameters.forEach((actualParam) => {
                const templateParam = _.find(templateParameter.parameters, {
                    name: actualParam.name,
                });

                this.patchParameterTemplateValues(templateParam, actualParam as ObjectParameter);
            });
        }
        templateParameter.value = actualParameter.value;
    }
}

export function FeatureDirective() {
    return {
        bindToController: true,
        controller: FeatureCtrl,
        controllerAs: "ctrl",
        restrict: "E",
        scope: {
            variables: "=",
            template: "=",
            feature: "="
        },
        templateUrl: "public/plugins/grafana-kairosdb-enhanced-datasource/partials/feature.html",
    };
}
