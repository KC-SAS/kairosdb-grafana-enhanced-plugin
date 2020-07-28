import {TimeOffset} from "../../utils/time_utils";

export interface RelativeTime extends TimeOffset {}

export interface TimeOverride {
    start_relative?: RelativeTime;
    end_relative?: RelativeTime;
    start_absolute?: number;
    end_absolute?: number;
}
