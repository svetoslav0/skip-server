const config = require("./base");
const request = config.Request;
const server = config.server;
const CONTENT_TYPE_HEADING = config.CONTENT_TYPE_HEADING;
const DEFAULT_CONTENT_TYPE = config.DEFAULT_CONTENT_TYPE;
const expect = config.expect;
const TOKEN_HEADING = config.TOKEN_HEADING;

const noTokenTest = (url: string ) => {
    it("Should not add a row in the database. No 'auth-token' header was provided.", () => {

        const expectedHttpStatus: number = 401;

        return request(server)
            .post(url)
            .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
            .send()
            .then(async (result: any) => {
                await expect(result.status).to.eql(expectedHttpStatus);
            });
    });
};

const wrongTokenTest = (url: string) => {
    it("Should not add a new row. Header 'auth-token' is provided but is invalid.", () => {
        const wrongTokenToSet: string = "WrOnGtOkEn";

        const expectedHttpStatus: number = 401;

        return request(server)
            .post(url)
            .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
            .set(TOKEN_HEADING, wrongTokenToSet)
            .then(async (result: any) => {
                await expect(result.status).to.eql(expectedHttpStatus);
            });
    });
};

module.exports = {
    noTokenTest: noTokenTest,
    wrongTokenTest: wrongTokenTest
};
