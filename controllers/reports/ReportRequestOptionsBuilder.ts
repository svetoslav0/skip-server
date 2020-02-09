export class ReportRequestOptionsBuilder {

    private readonly forbiddenFields: string[] = [
        'id',
        'userId'
    ];

    public editOptionsBuilder(reqBody: any, databaseFields: string[]) {
        // Get only the fields that attend in the database
        // and removed the forbidden ones
        const allowedKeys: string[] = databaseFields
            .filter(field => !this.forbiddenFields.includes(field))
            .filter(field => Object.keys(reqBody).includes(field));

        // Build an object by filtering the reqBody
        // with the allowed keys
        return Object.keys(reqBody)
            .filter(key => allowedKeys.includes(key))
            .reduce((obj: {[k: string]: any}, key: string) => {
                obj[key] = reqBody[key];
                return obj;
            }, {});
    }
}
