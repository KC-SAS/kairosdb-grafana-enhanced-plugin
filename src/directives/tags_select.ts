import _ from "lodash";

export class TagsSelectCtrl {
    public tagValues: string[];
    public availableValues: string[];
    public selectedValues: string[];
    public segments: any[];

    /** @ngInject **/
    constructor(private uiSegmentSrv) {
        this.selectedValues = this.selectedValues || [];
        this.availableValues = this.tagValues;
        this.segments = this.selectedValues.map((tagValue) => this.uiSegmentSrv.newSegment(tagValue));
        this.segments.push(this.uiSegmentSrv.newPlusButton());
    }

    public onChange(): void {
        if (!_.isNil(_.last(this.segments).value)) {
            this.segments.push(this.uiSegmentSrv.newPlusButton());
        }
        this.update();
    }

    public remove(segment): void {
        this.segments = _.without(this.segments, segment);
        this.update();
    }

    private update(): void {
        this.selectedValues = this.segments
            .map((tagSegment) => tagSegment.value)
            .filter((value) => !_.isNil(value));

        this.availableValues = this.tagValues.reduce((acc, cur) => {
            if (this.selectedValues.indexOf(cur) === -1) {
                acc.push(cur);
            }
            return acc;
        }, []);
    }
}

export function TagsSelectDirective() {
    return {
        bindToController: true,
        controller: TagsSelectCtrl,
        controllerAs: "ctrl",
        restrict: "E",
        scope: {
            selectedValues: "=",
            tagName: "=",
            tagValues: "="
        },
        templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/tags.select.html"
    };
}
