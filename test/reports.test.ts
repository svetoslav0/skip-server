import httpStatus from "http-status-codes";

import { server, database, expect, Request } from "./base";
import { HttpMethod } from "./httpMethod";

import {
    noTokenTest,
    wrongTokenTest
} from "./commonTests";

import { ReportsRepository } from "../repositories/ReportsRepository";

const reportsRepository: ReportsRepository = new ReportsRepository(database);

const CONTENT_TYPE_HEADING = process.env.CONTENT_TYPE_HEADING || "";
const DEFAULT_CONTENT_TYPE = process.env.DEFAULT_CONTENT_TYPE || "";
const TOKEN_HEADING = process.env.TOKEN_HEADING || "";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const EMPLOYEE_TOKEN = process.env.EMPLOYEE_TOKEN || "";
const EMPLOYEE_REPORT_ID = +process.env.EMPLOYEE_REPORT_ID! || 0;

const REPORTS_CONTROLLERS_URL: string = "/reports";
const CREATE_URL: string = `${REPORTS_CONTROLLERS_URL}`;
const URL_WITH_PARAM = (id: number | string) => {
    return `${REPORTS_CONTROLLERS_URL}/${id}`;
};

describe(`${REPORTS_CONTROLLERS_URL} tests`, () => {
    describe(`POST ${CREATE_URL} tests`, () => {

        noTokenTest(HttpMethod.Post, CREATE_URL);
        wrongTokenTest(HttpMethod.Post, CREATE_URL);

        it("Should add a new report. After the test passes, the new report should be deleted", () => {
             const nameToSend: string = "September 2019";
             const userIdToSend: number = 4;

             const objectToSend = {
                 name: nameToSend,
                 userId: userIdToSend
             };

             const expectedIsReportDeleted: boolean = true;

             return Request(server)
                 .post(CREATE_URL)
                 .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                 .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                 .send(objectToSend)
                 .then(async (result: any) => {
                     await expect(result.status).to.eql(httpStatus.CREATED);

                     return result.body.data.resourceId;
                 })
                 .then(async (reportId: number) => {
                     const result = await reportsRepository.deleteById(reportId);
                     await expect(result).to.eql(expectedIsReportDeleted);
                 });
        });

        it("Should add one more report.", () => {
            const nameToSend: string = "September 2019";

            const objectToSend = {
                name: nameToSend
            };

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");
                    await expect(result.body.data).to.have.property("resourceId");

                    await expect(result.body.data.resourceId).to.be.a("number");
                    await expect(result.body.data.success).to.eql(true);
                    await expect(result.body.data.message).to.be.a("string");

                    return result.body.data.resourceId;
                })
                .then(async (resourceId: number) => {
                    const result = await reportsRepository.deleteById(resourceId);
                    await expect(result).to.eql(true);
                });
        });

        it("Should not add a new report. Field 'name' is not provided", () => {
            const userIdToSend: number = 4;

            const objectToSend = {
                userId: userIdToSend
            };

            const expectedSuccessProperty: string = "success";
            const expectedMessageProperty: string = "message";
            const expectedErrorsProperty: string = "errors";

            const expectedSuccess: boolean = false;
            const expectedErrorsCount: number = 1;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(result.body.data).to.have.property(expectedSuccessProperty);
                    await expect(result.body.data).to.have.property(expectedMessageProperty);
                    await expect(result.body.data).to.have.property(expectedErrorsProperty);

                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.message).to.be.a("string");
                    await expect(result.body.data.errors).to.be.an("array");
                    await expect(result.body.data.errors.length).to.eql(expectedErrorsCount);
                });
        });

        it("Should not add a new report. No fields are provided", () => {

            const expectedSuccessProperty: string = "success";
            const expectedMessageProperty: string = "message";
            const expectedErrorsProperty: string = "errors";

            const expectedSuccess: boolean = false;
            const minimumExpectedErrorsCount: number = 1;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.BAD_REQUEST);
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

        noTokenTest(HttpMethod.Put, URL_WITH_PARAM(14));
        wrongTokenTest(HttpMethod.Put, URL_WITH_PARAM(14));

        it("Should update the report. Provided token and report ID are employee's",  () => {
            const nameToSend: string = "October 2020";
            const userIdToSend: number = 4;

            const objectToSend = {
                name: nameToSend,
                userId: userIdToSend
            };

            const expectedSuccess: boolean = true;

            return Request(server)
                .put(URL_WITH_PARAM(EMPLOYEE_REPORT_ID))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.resourceId).to.eql(EMPLOYEE_REPORT_ID);
                });
        });

        it(`Should update the report. Provided report ID does not belong to this user
            but the user role is ADMIN`, () => {
            const nameToSend: string = "Sept 2020";
            const userIdToSend: number = 137;

            const objectToSend = {
                name: nameToSend,
                userId: userIdToSend
            };

            const expectedSuccess: boolean = true;

            return Request(server)
                .put(URL_WITH_PARAM(EMPLOYEE_REPORT_ID))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.resourceId).to.eql(EMPLOYEE_REPORT_ID);
                });
        });

        it("Should not update the report. " +
            "Provided report ID does not belong to this user (employee)", () => {
            const nameToSend: string = "Dec 2020";
            const userIdToSend: number = 5;
            const reportId: number = 15;

            const objectToSend = {
                name: nameToSend,
                userId: userIdToSend
            };

            const expectedSuccess: boolean = false;

            return Request(server)
                .put(URL_WITH_PARAM(reportId))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.FORBIDDEN);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
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

            const expectedSuccess: boolean = false;
            const expectedErrorsProperty: string = "errors";

            return Request(server)
                .put(URL_WITH_PARAM(reportIdToUpdate))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data).to.have.property(expectedErrorsProperty);
                });
        });

        it("Should not update. Provided ID is not numeric", () => {
            const reportIdToSend: string = "15a";

            return Request(server)
                .put(URL_WITH_PARAM(reportIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");
                    await expect(result.body.data).to.have.property("errors");

                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");
                    await expect(result.body.data.errors).to.be.an("array");

                    await expect(result.body.data.success).to.eql(false);
                });
        });

    });

    describe(`DELETE ${REPORTS_CONTROLLERS_URL}/id tests`, () => {

        noTokenTest(HttpMethod.Delete, URL_WITH_PARAM(14));
        wrongTokenTest(HttpMethod.Delete, URL_WITH_PARAM(14));

        it(`Should archive the report. Provided token and report ID are employee's`, () => {
            const dataProperty: string = "data";
            const successProperty: string = "success";
            const expectedSuccess: boolean = true;

            return Request(server)
                .delete(URL_WITH_PARAM(EMPLOYEE_REPORT_ID))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);
                    await expect(result.body).to.have.property(dataProperty);
                    await expect(result.body.data).to.have.property(successProperty);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                });
        });

        it(`Should archive the report. Provide ID does not belong to this user
            but user role is ADMIN`, () => {
            const dataProperty: string = "data";
            const successProperty: string = "success";
            const expectedSuccess: boolean = true;

            return Request(server)
                .delete(URL_WITH_PARAM(EMPLOYEE_REPORT_ID))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);
                    await expect(result.body).to.have.property(dataProperty);
                    await expect(result.body.data).to.have.property(successProperty);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                });
        });

        it(`Should not archive the report. Provided ID does not belong to this user`, () => {
            const dataProperty: string = "data";
            const successProperty: string = "success";
            const expectedSuccess: boolean = false;
            const reportId: number = 15;

            return Request(server)
                .delete(URL_WITH_PARAM(reportId))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.FORBIDDEN);
                    await expect(result.body).to.have.property(dataProperty);
                    await expect(result.body.data).to.have.property(successProperty);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                });
        });

        it(`Should not archive the report.
        The given ID does not correspond to an existing report`, () => {
            const reportIdToSend: number = 99999;

            const dataProperty: string = "data";
            const successProperty: string = "success";
            const expectedSuccess: boolean = false;

            return Request(server)
                .delete(URL_WITH_PARAM(reportIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(result.body).to.have.property(dataProperty);
                    await expect(result.body.data).to.have.property(successProperty);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                });
        });

        it("Should not archive. Provided ID is not numeric", () => {
            const reportIdToSend: string = "15a";

            const expectedSuccess: boolean = false;

            return Request(server)
                .put(URL_WITH_PARAM(reportIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");
                    await expect(result.body.data).to.have.property("errors");

                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");
                    await expect(result.body.data.errors).to.be.an("array");

                    await expect(result.body.data.success).to.eql(false);
                });
        });
    });
});
