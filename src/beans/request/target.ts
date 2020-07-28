import { Feature } from "../features/feature";
import {TimeOffset} from "../../utils/time_utils";
import { Tags } from "./metric_tags";
import {FetchPreviousSample} from "../features/fetch_previous_sample";
import {SafeGuard} from "../features/safeguard";

export class KairosDBTarget {
    public metricName: string = undefined;
    public alias: string = undefined;
    public tags: Tags = {};
    public features: Feature[] = [];
    public group_limit: number = 0;
    public time_offset: TimeOffset = null;
    public fetch_previous_sample: FetchPreviousSample = null;
    public safeguard: SafeGuard = null;
}
