/// <reference path="node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import angular from "angular";

import { KairosDBConfigCtrl } from "./core/config_ctrl";
import { KairosDBDatasource } from "./core/datasource";
import { FeatureDirective } from "./directives/feature";
import { FeatureComponentDirective } from "./directives/feature_component";
import { FeatureComponentEditorDirective } from "./directives/feature_component_editor";
import { MetricNameFieldDirective } from "./directives/metric_name_field";
import { KairosDBQueryCtrl } from "./core/query_ctrl";
import { TagInputDirective } from "./directives/tag_input";
import { TagsSelectDirective } from "./directives/tags_select";
import { KairosDBAnnotationsQueryCtrl } from "./core/annotations_query_ctrl";

class KairosDBQueryOptionsCtrl {
  public static templateUrl = "partials/query.options.html";
}

export {
  KairosDBDatasource as Datasource,
  KairosDBQueryCtrl as QueryCtrl,
  KairosDBConfigCtrl as ConfigCtrl,
  KairosDBQueryOptionsCtrl as QueryOptionsCtrl,
  KairosDBAnnotationsQueryCtrl as AnnotationsQueryCtrl
};

angular
  .module("grafana.directives")
  .directive("kairosdbEnhancedMetricNameField", MetricNameFieldDirective)
  .directive("kairosdbEnhancedTagsSelect", TagsSelectDirective)
  .directive("kairosdbEnhancedTagInput", TagInputDirective)
  .directive("kairosdbEnhancedFeature", FeatureDirective)
  .directive("kairosdbEnhancedFeatureComponent", FeatureComponentDirective)
  .directive("kairosdbEnhancedFeatureComponentEditor", FeatureComponentEditorDirective)
  .directive("kairosdbEnhancedCustomAutofocus", ($timeout) => {
    return {
      restrict: "A",
      link: (scope, element) => {$timeout(() => {
        element[0].focus();
      }, 0);
      }
    };
  });
