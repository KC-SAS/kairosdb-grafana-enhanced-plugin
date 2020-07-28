import _ from "lodash";

import { FeatureComponent } from "../beans/features/component";
import {FeatureParameter, JsonFeatureParameter} from "../beans/features/parameter";

export class FeatureComponentEditorCtrl {
    public component: FeatureComponent;
    public showOptional = false;

    /** @ngInject **/
    public constructor($scope) {
        $scope.$watch("$parent.ctrl.showOptional", (newValue) => {
            this.showOptional = newValue;
        }, true);
    }

    public showParameter(parameter: JsonFeatureParameter): boolean {
        return !parameter.optional || this.showOptional;
    }

    public needsLabel(parameter: JsonFeatureParameter): boolean {
        return parameter.type !== "object" && parameter.type !== "bool";
    }

    public pushItem(parameter: FeatureParameter, item: string) {
        if (item !== null && _.isArray(parameter.value)) {
            parameter.value.push(item);
        }
    }
}

export function FeatureComponentEditorDirective() {
    return {
        bindToController: true,
        controller: FeatureComponentEditorCtrl,
        controllerAs: "ctrl",
        restrict: "E",
        scope: {
            component: "="
        },
        templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/feature.component.editor.html",
    };
}
