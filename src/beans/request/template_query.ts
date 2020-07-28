export interface TemplateQuery {
    metric?: string;
    tagKey?: string;
    // can't use only string[] it causes override on the two other keys
    [x: string]: string | string[];
}
