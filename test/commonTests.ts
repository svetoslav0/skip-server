const config = require("./base");
const request = config.Request;
const server = config.server;
const CONTENT_TYPE_HEADING = config.CONTENT_TYPE_HEADING;
const DEFAULT_CONTENT_TYPE = config.DEFAULT_CONTENT_TYPE;
const expect = config.expect;
const TOKEN_HEADING = config.TOKEN_HEADING;

import httpStatus from "http-status-codes";

const noTokenTestPost = (url: string ) => {
    it("Should not add a row in the database. No 'auth-token' header was provided", () => {
        return request(server)
            .post(url)
            .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
            .send()
            .then(async (result: any) => {
                await expect(result.status).to.eql(httpStatus.UNAUTHORIZED);
            });
    });
};

const wrongTokenTestPost = (url: string) => {
    it("Should not add a new row. Header 'auth-token' is provided but is invalid", () => {
        const wrongTokenToSet: string = "WrOnGtOkEn";

        return request(server)
            .post(url)
            .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
            .set(TOKEN_HEADING, wrongTokenToSet)
            .then(async (result: any) => {
                await expect(result.status).to.eql(httpStatus.UNAUTHORIZED);
            });
    });
};

const noTokenTestPut = (url: string) => {
    it("Should not update row(s) in the database. No 'auth-token' header was provided", () => {
        return request(server)
            .put(url)
            .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
            .send()
            .then(async (result: any) => {
                 await expect(result.status).to.eql(httpStatus.UNAUTHORIZED);
            });
    });
};

const wrongTokenTestPut = (url: string) => {
    it("Should not update row(s) in the database. Header 'auth-token' is provided, but is invalid", () => {
        const wrongTokenToSet: string = "ThisIsWrongToken";

        return request(server)
            .put(url)
            .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
            .set(TOKEN_HEADING, wrongTokenToSet)
            .then(async (result: any) => {
                await expect(result.status).to.eql(httpStatus.UNAUTHORIZED);
            });
    });
}


module.exports = {
    noTokenTestPost,
    wrongTokenTestPost,
    noTokenTestPut,
    wrongTokenTestPut
};
