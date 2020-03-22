process.env.ENVIRONMENT = "test";

import { server, database } from "../server";
import { ReportsModel } from "../models/ReportsModel";

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

import chai from "chai";
import chaiHttp from "chai-http";
import "mocha";

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

const reportsModel: ReportsModel = new ReportsModel(database);

const DEFAULT_CONTENT_TYPE: string = "application/x-www-form-urlencoded";
const CONTENT_TYPE_HEADING: string = "content-type";
const TOKEN_HEADING: string = "auth-token";

const REPORTS_CONTROLLERS_URL: string = "/reports";
const CREATE_URL: string = `${REPORTS_CONTROLLERS_URL}`;
const EDIT_URL = (id: number) => {
    return `${REPORTS_CONTROLLERS_URL}/${id}`;
};

const token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGVJZCI6MiwiaWF0IjoxNTg0Mjg2MjUzfQ.dUm6sU7RobQucIRH3Vf1C-tr2EgwL0gQ49xQ9CAPIqs";

describe(`${REPORTS_CONTROLLERS_URL} tests`, () => {
    describe(`POST ${CREATE_URL} tests`, () => {
        it("Should add a new report. After the test passes, the new report should be deleted.", () => {
             const nameToSend: string = "September 2019";
             const userIdToSend: number = 4;

             const objectToSend = {
                 name: nameToSend,
                 userId: userIdToSend
             };

             const expectedHttpStatus: number = 200;
             const expectedIsReportDeleted: boolean = true;

             return request(server)
                 .post(CREATE_URL)
                 .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                 .set(TOKEN_HEADING, token)
                 .send(objectToSend)
                 .then(async (result) => {
                     await expect(result.status).to.eql(expectedHttpStatus);

                     return result.body.data.reportId;
                 })
                 .then(async (reportId) => {
                     const result = await reportsModel.deleteById(reportId);
                     await expect(result).to.eql(expectedIsReportDeleted);
                 });
        });

        it("Should not add a new report. No 'auth-token' header was provided.", () => {
            const nameToSend: string = "May 2020";
            const userIdToSend: number = 4;

            const objectToSend = {
                name: nameToSend,
                userId: userIdToSend
            };

            const expectedHttpStatus: number = 401;

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (result) => {
                    await expect(result.status).to.eql(expectedHttpStatus);

                });
        });

        it("Should not add a new report. Header 'auth-token' is provided but is invalid.", () => {
            const nameToSend: string = "August 2020";
            const userIdToSend: number = 4;
            const wrongTokenToSet: string = "WrOnGtOkEn";

            const objectToSend = {
                name: nameToSend,
                userId: userIdToSend
            };

            const expectedHttpStatus: number = 400;

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, wrongTokenToSet)
                .send(objectToSend)
                .then(async (result) => {
                    await expect(result.status).to.eql(expectedHttpStatus);
                });
        });

        it("Should not add a new report. Field 'name' is not provided.", () => {
            const userIdToSend: number = 4;

            const objectToSend = {
                userId: userIdToSend
            };

            const expectedHttpStatus: number = 400;
            const expectedSuccessProperty: string = "success";
            const expectedMessageProperty: string = "message";
            const expectedErrorsProperty: string = "errors";

            const expectedSuccess: boolean = false;
            const expectedErrorsCount: number = 1;

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result) => {
                    await expect(result.status).to.eql(expectedHttpStatus);
                    await expect(result.body.data).to.have.property(expectedSuccessProperty);
                    await expect(result.body.data).to.have.property(expectedMessageProperty);
                    await expect(result.body.data).to.have.property(expectedErrorsProperty);

                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.message).to.be.a("string");
                    await expect(result.body.data.errors).to.be.an("array");
                    await expect(result.body.data.errors.length).to.eql(expectedErrorsCount);
                });
        });

        it("Should not add a new report. Field 'userId' is not provided.", () => {
            const nameToSend: string = "September 2019";

            const objectToSend = {
                name: nameToSend
            };

            const expectedHttpStatus: number = 400;
            const expectedSuccessProperty: string = "success";
            const expectedMessageProperty: string = "message";
            const expectedErrorsProperty: string = "errors";

            const expectedSuccess: boolean = false;
            const minimumExpectedErrorsCount: number = 1;

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result) => {
                    await expect(result.status).to.eql(expectedHttpStatus);
                    await expect(result.body.data).to.have.property(expectedSuccessProperty);
                    await expect(result.body.data).to.have.property(expectedMessageProperty);
                    await expect(result.body.data).to.have.property(expectedErrorsProperty);

                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.message).to.be.a("string");
                    await expect(result.body.data.errors).to.be.an("array");
                    await expect(result.body.data.errors.length).to.be.at.least(minimumExpectedErrorsCount);
                });
        });

        it("Should not add a new report. No fields are provided", () => {
            const expectedHttpStatus: number = 400;
            const expectedSuccessProperty: string = "success";
            const expectedMessageProperty: string = "message";
            const expectedErrorsProperty: string = "errors";

            const expectedSuccess: boolean = false;
            const minimumExpectedErrorsCount: number = 2;

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .then(async (result) => {
                    await expect(result.status).to.eql(expectedHttpStatus);
                    await expect(result.body.data).to.have.property(expectedErrorsProperty);
                    await expect(result.body.data).to.have.property(expectedMessageProperty);
                    await expect(result.body.data).to.have.property(expectedSuccessProperty);

                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.message).to.be.a("string");
                    await expect(result.body.data.errors).to.be.an("array");
                    await expect(result.body.data.errors.length).to.be.at.least(minimumExpectedErrorsCount);
                });
        });
    });

    describe(`PUT ${REPORTS_CONTROLLERS_URL}/{id} tests`, () => {
        it("Should update an report.",  () => {
            const nameToSend: string = "October 2020";
            const userIdToSend: number = 4;
            const reportIdToUpdate: number = 15;

            const objectToSend = {
                name: nameToSend,
                userId: userIdToSend
            };

            const expectedStatus: number = 200;
            const expectedSuccess: boolean = true;

            return request(server)
                .put(EDIT_URL(reportIdToUpdate))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result) => {
                    await expect(result.status).to.eql(expectedStatus);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.reportId).to.eql(reportIdToUpdate);
                });
        });

        it(`Should not update the report.
            The given "id" does not correspond to an existing report`,  () => {
            const nameToSend: string = "October 2020";
            const userIdToSend: number = 4;
            const reportIdToUpdate: number = 91501;

            const objectToSend = {
                name: nameToSend,
                userId: userIdToSend
            };

            const expectedStatus: number = 400;
            const expectedSuccess: boolean = false;
            const expectedErrorsProperty: string = "errors";

            return request(server)
                .put(EDIT_URL(reportIdToUpdate))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result) => {
                    await expect(result.status).to.eql(expectedStatus);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data).to.have.property(expectedErrorsProperty);
                });
        });

    });
});
