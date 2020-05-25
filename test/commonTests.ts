
import httpStatus from "http-status-codes";
import { HttpMethod } from "./httpMethods";
import { server, expect, Request } from "./base";

const CONTENT_TYPE_HEADING = process.env.CONTENT_TYPE_HEADING || "";
const DEFAULT_CONTENT_TYPE = process.env.DEFAULT_CONTENT_TYPE || "";

const TOKEN_HEADING = process.env.TOKEN_HEADING || "";

const httpMethodFactory = (method: HttpMethod, url: string) => {
    switch (method) {
        case HttpMethod.Get:
            return Request(server).get(url);
        case HttpMethod.Post:
            return Request(server).post(url);
        case HttpMethod.Put:
            return Request(server).put(url);
        case HttpMethod.Delete:
            return Request(server).delete(url);
    }
};

const noTokenTest = (httpMethod: HttpMethod, url: string) => {
    it("Should fail. No 'auth-token' header is provided", () => {
        httpMethodFactory(httpMethod, url)
            .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
            .send()
            .then(async (result: any) => {
                await expect(result.status).to.eql(httpStatus.UNAUTHORIZED);
            });
    });
};

const wrongTokenTest = (httpMethod: HttpMethod, url: string) => {
    it("Should fail. Header 'auth-token' is provided but is invalid", () => {
        const wrongTokenToSend: string = "WrOnGtOkEn";

        httpMethodFactory(httpMethod, url)
            .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
            .set(TOKEN_HEADING, wrongTokenToSend)
            .then(async (result: any) => {
                await expect(result.status).to.eql(httpStatus.UNAUTHORIZED);
            });
    });
};

export {
    noTokenTest,
    wrongTokenTest
};
