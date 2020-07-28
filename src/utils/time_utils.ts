import moment from "moment";

export interface TimeOffset {
    value: number;
    unit: string;
}

export const TIME_UNITS = [
    "milliseconds",
    "seconds",
    "minutes",
    "hours",
    "days",
    "weeks",
    "months",
    "years"
];

export function computeTimeOffsetMs(offset: TimeOffset) {
    return moment().add(offset.value, offset.unit).valueOf() - moment().valueOf();
}
