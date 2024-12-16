export const generateQueryFilters = (queryParams: any, fields: any, afterGenerate?: (query: any) => void) => {
    let query: any = {};
    for (const key in queryParams) {
        if (fields.includes(key)) {
            if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
                query[key] = queryParams[key];
            }
        }
    }
    if (afterGenerate) {
        afterGenerate(query);
    }

    return query;
};
