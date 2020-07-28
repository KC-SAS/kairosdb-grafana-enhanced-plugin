namespace Response {
    export type Value = [number, number];

    export interface Body {
        queries: Query[];
    }

    export interface Query {
        sample_size: number;
        results: Result[];
    }

    export interface Result {
        name: string;
        group_by: GroupBy[];
        values: Value[];
    }

    export interface GroupBy {
        name: string;
        group: GroupByValue;
    }

    export interface GroupByValue {
        [name: string]: number | string;
    }
}
