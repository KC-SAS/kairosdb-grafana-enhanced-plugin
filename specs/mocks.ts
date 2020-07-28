export const buildTemplatingSrvMock = (variables) => {
    return {
        replace: (expression) => {
            let replacedExpression = expression;
            _.forOwn(variables, (values, key) => {
                const templateValue = values.length > 1 ? "{" + _.join(values, ",") + "}" : values[0];
                replacedExpression = replacedExpression.replace("$" + key, templateValue);
                replacedExpression = replacedExpression.replace("[[" + key + "]]", templateValue);
            });
            return replacedExpression;
        },
    };
};

export const buildNoopTemplatingSrvMock = () => {
    return {
        replace: (expression) => expression,
    };
};
