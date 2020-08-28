import { FeatureComponent } from "../beans/features/component";

export class FeatureComponentCtrl {
    public component: FeatureComponent;
}

export function FeatureComponentDirective() {
    return {
        bindToController: true,
        controller: FeatureComponentCtrl,
        controllerAs: "ctrl",
        restrict: "E",
        scope: {
            component: "=",
            onMoveUp: "&",
            onMoveDown: "&",
            onEdit: "&",
            onRemove: "&",
        },
        templateUrl: "public/plugins/grafana-kairosdb-enhanced-datasource/partials/feature.component.html",
    };
}
