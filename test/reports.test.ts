import httpStatus from "http-status-codes";

import {database, expect, Request, server} from "./base";
import {HttpMethod} from "./httpMethods";

import {noTokenTest, wrongTokenTest} from "./commonTests";

import {ReportsRepository} from "../repositories/ReportsRepository";

const reportsRepository: ReportsRepository = new ReportsRepository(database);

const CONTENT_TYPE_HEADING = process.env.CONTENT_TYPE_HEADING || "";
const DEFAULT_CONTENT_TYPE = process.env.DEFAULT_CONTENT_TYPE || "";
const TOKEN_HEADING = process.env.TOKEN_HEADING || "";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const EMPLOYEE_TOKEN = process.env.EMPLOYEE_TOKEN || "";

const EMPLOYEE_REPORT_ID = +process.env.EMPLOYEE_REPORT_ID! || 0;
const ADMIN_REPORT_ONE_ID = +process.env.ADMIN_REPORT_ONE_ID! || 0;
const ADMIN_REPORT_TWO_ID = +process.env.ADMIN_REPORT_TWO_ID! || 0;

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

    describe(`GET ${REPORTS_CONTROLLERS_URL}/id tests`, () => {

        noTokenTest(HttpMethod.Get, URL_WITH_PARAM(EMPLOYEE_REPORT_ID));
        wrongTokenTest(HttpMethod.Get, URL_WITH_PARAM(EMPLOYEE_REPORT_ID));

        it("Should return data for requested report. Success test No. 1", () => {

            const expectedReportName: string = "Sept 2020";
            const expectedUserId: number = 137;
            const expectedReportEntityId: number = 3;
            const expectedReportEntityDate: string = "2020-05-13 00:00:00.000";
            const expectedReportEntityClassName: string = "Micro:bit";
            const expectedReportEntityClassRoleName: string = "Co-Lecturer";
            const expectedReportEntityHoursSpend: number = 1;
            const expectedReportEntityDescription = null;

            return Request(server)
                .get(URL_WITH_PARAM(EMPLOYEE_REPORT_ID))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);

                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data)
                        .to.have.property("name")
                        .that.is.a("string")
                        .that.is.eql(expectedReportName);

                    await expect(result.body.data)
                        .to.have.property("userId")
                        .that.is.a("number")
                        .that.is.eql(expectedUserId);

                    await expect(result.body.data)
                        .to.have.property("reportEntities")
                        .that.is.an("array")
                        .that.is.not.empty;

                    const firstReportEntity = result.body.data.reportEntities[0];

                    await expect(firstReportEntity)
                        .to.have.property("id")
                        .that.is.a("number")
                        .that.is.eql(expectedReportEntityId);

                    await expect(firstReportEntity)
                        .to.have.property("date")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityDate);

                    await expect(firstReportEntity)
                        .to.have.property("className")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityClassName);

                    await expect(firstReportEntity)
                        .to.have.property("classRoleName")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityClassRoleName);

                    await expect(firstReportEntity)
                        .to.have.property("hoursSpend")
                        .that.is.a("number")
                        .that.is.eql(expectedReportEntityHoursSpend);

                    await expect(firstReportEntity)
                        .to.have.property("description")
                        .that.is.a("null")
                        .that.is.eql(expectedReportEntityDescription);
                });
        });

        it("Should return data for requested report. Success test No. 2", () => {

            const expectedReportName: string = "Jan 2021";
            const expectedUserId: number = 136;
            const expectedReportEntitiesCount: number = 3;
            const expectedReportEntityId: number = 114;
            const expectedReportEntityDate: string = "2021-01-14 00:00:00.000";
            const expectedReportEntityClassName: string = "HTML and CSS";
            const expectedReportEntityClassRoleName: string = "Lecturer";
            const expectedReportEntityHoursSpend: number = 2;
            const expectedReportEntityDescription = "Some Rand Desc";

            return Request(server)
                .get(URL_WITH_PARAM(ADMIN_REPORT_ONE_ID))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);

                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data)
                        .to.have.property("name")
                        .that.is.a("string")
                        .that.is.eql(expectedReportName);

                    await expect(result.body.data)
                        .to.have.property("userId")
                        .that.is.a("number")
                        .that.is.eql(expectedUserId);

                    await expect(result.body.data)
                        .to.have.property("reportEntities")
                        .that.is.an("array")
                        .that.has.lengthOf(expectedReportEntitiesCount);

                    const firstReportEntity = result.body.data.reportEntities[0];

                    await expect(firstReportEntity)
                        .to.have.property("id")
                        .that.is.a("number")
                        .that.is.eql(expectedReportEntityId);

                    await expect(firstReportEntity)
                        .to.have.property("date")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityDate);

                    await expect(firstReportEntity)
                        .to.have.property("className")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityClassName);

                    await expect(firstReportEntity)
                        .to.have.property("classRoleName")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityClassRoleName);

                    await expect(firstReportEntity)
                        .to.have.property("hoursSpend")
                        .that.is.a("number")
                        .that.is.eql(expectedReportEntityHoursSpend);

                    await expect(firstReportEntity)
                        .to.have.property("description")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityDescription);
                });
        });

        it("Should return data for requested report. Success test No. 3", () => {

            const expectedReportName: string = "March 2021";
            const expectedUserId: number = 136;
            const expectedReportEntitiesCount: number = 1;
            const expectedReportEntityId: number = 117;
            const expectedReportEntityDate: string = "2021-02-15 00:00:00.000";
            const expectedReportEntityClassName: string = "HTML and CSS";
            const expectedReportEntityClassRoleName: string = "Lecturer";
            const expectedReportEntityHoursSpend: number = 4;
            const expectedReportEntityDescription = "Some Desc";

            return Request(server)
                .get(URL_WITH_PARAM(ADMIN_REPORT_TWO_ID))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);

                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data)
                        .to.have.property("name")
                        .that.is.a("string")
                        .that.is.eql(expectedReportName);

                    await expect(result.body.data)
                        .to.have.property("userId")
                        .that.is.a("number")
                        .that.is.eql(expectedUserId);

                    await expect(result.body.data)
                        .to.have.property("reportEntities")
                        .that.is.an("array")
                        .that.has.lengthOf(expectedReportEntitiesCount);

                    const firstReportEntity = result.body.data.reportEntities[0];

                    await expect(firstReportEntity)
                        .to.have.property("id")
                        .that.is.a("number")
                        .that.is.eql(expectedReportEntityId);

                    await expect(firstReportEntity)
                        .to.have.property("date")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityDate);

                    await expect(firstReportEntity)
                        .to.have.property("className")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityClassName);

                    await expect(firstReportEntity)
                        .to.have.property("classRoleName")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityClassRoleName);

                    await expect(firstReportEntity)
                        .to.have.property("hoursSpend")
                        .that.is.a("number")
                        .that.is.eql(expectedReportEntityHoursSpend);

                    await expect(firstReportEntity)
                        .to.have.property("description")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityDescription);
                });
        });

        it("Should fail. Requested Report ID is not numeric", () => {

            const id: string = "15a";

            return Request(server)
                .get(URL_WITH_PARAM(id))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.BAD_REQUEST);

                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data)
                        .to.have.property("error")
                        .that.is.a("string");
                });
        });

        it("Should fail. Requested Report ID does not exist", () => {

            const id: number = 0;

            return Request(server)
                .get(URL_WITH_PARAM(id))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.BAD_REQUEST);

                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data)
                        .to.have.property("error")
                        .that.is.a("string");
                });
        });
    });

    describe(`GET ${REPORTS_CONTROLLERS_URL} tests`, () => {

        noTokenTest(HttpMethod.Get, REPORTS_CONTROLLERS_URL);
        wrongTokenTest(HttpMethod.Get, REPORTS_CONTROLLERS_URL);

        it("Should succeed and return requested data. Success test No. 1", () => {

            const expectedCount: number = 2;
            const expectedReportName: string = "Jan 2021";
            const expectedUserId: number = 136;
            const expectedReportDescription: string = "Report for January 2021";
            const expectedReportEntitiesCount: number = 3;
            const expectedReportEntityId: number = 114;
            const expectedReportEntityDate: string = "2021-01-14 00:00:00.000";
            const expectedReportEntityClassName: string = "HTML and CSS";
            const expectedReportEntityClassRoleName: string = "Lecturer";
            const expectedReportEntityHoursSpend: number = 2;
            const expectedReportEntityDescription: string = "Some Rand Desc";

            return Request(server)
                .get(REPORTS_CONTROLLERS_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);
                    await expect(result.body).to.have.property("data");

                    await expect(result.body.data)
                        .to.have.property("count")
                        .that.is.a("number")
                        .that.is.eql(expectedCount);

                    await expect(result.body.data)
                        .to.have.property("reports")
                        .that.is.an("array")
                        .that.has.lengthOf(expectedCount);

                    const firstReport = result.body.data.reports[0];
                    await expect(firstReport)
                        .to.have.property("name")
                        .that.is.a("string")
                        .that.is.eql(expectedReportName);

                    await expect(firstReport)
                        .to.have.property("userId")
                        .that.is.a("number")
                        .that.is.eql(expectedUserId);

                    await expect(firstReport)
                        .to.have.property("description")
                        .that.is.a("string")
                        .that.eql(expectedReportDescription);

                    await expect(firstReport)
                        .to.have.property("reportEntities")
                        .that.is.an("array")
                        .that.has.lengthOf(expectedReportEntitiesCount);

                    const firstReportEntity = firstReport.reportEntities[0];

                    await expect(firstReportEntity)
                        .to.have.property("id")
                        .that.is.a("number")
                        .that.is.eql(expectedReportEntityId);

                    await expect(firstReportEntity)
                        .to.have.property("date")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityDate);

                    await expect(firstReportEntity)
                        .to.have.property("className")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityClassName);

                    await expect(firstReportEntity)
                        .to.have.property("classRoleName")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityClassRoleName);

                    await expect(firstReportEntity)
                        .to.have.property("hoursSpend")
                        .that.is.a("number")
                        .that.is.eql(expectedReportEntityHoursSpend);

                    await expect(firstReportEntity)
                        .to.have.property("description")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityDescription);
                });
        });

        it("Should succeed and return requested data. Success test No. 2", () => {

            const expectedCount: number = 14;
            const expectedReportName: string = "Sept 2020";
            const expectedUserId: number = 137;
            const expectedReportDescription = null;
            const expectedReportEntitiesCount: number = 11;
            const expectedReportEntityId: number = 3;
            const expectedReportEntityDate: string = "2020-05-13 00:00:00.000";
            const expectedReportEntityClassName: string = "Micro:bit";
            const expectedReportEntityClassRoleName: string = "Co-Lecturer";
            const expectedReportEntityHoursSpend: number = 1;
            const expectedReportEntityDescription = null;

            return Request(server)
                .get(REPORTS_CONTROLLERS_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);
                    await expect(result.body).to.have.property("data");

                    await expect(result.body.data)
                        .to.have.property("count")
                        .that.is.a("number")
                        .that.is.eql(expectedCount);

                    await expect(result.body.data)
                        .to.have.property("reports")
                        .that.is.an("array")
                        .that.has.lengthOf(expectedCount);

                    const firstReport = result.body.data.reports[0];
                    await expect(firstReport)
                        .to.have.property("name")
                        .that.is.a("string")
                        .that.is.eql(expectedReportName);

                    await expect(firstReport)
                        .to.have.property("userId")
                        .that.is.a("number")
                        .that.is.eql(expectedUserId);

                    await expect(firstReport)
                        .to.have.property("description")
                        .that.is.a("null")
                        .that.eql(expectedReportDescription);

                    await expect(firstReport)
                        .to.have.property("reportEntities")
                        .that.is.an("array")
                        .that.has.lengthOf(expectedReportEntitiesCount);

                    const firstReportEntity = firstReport.reportEntities[0];

                    await expect(firstReportEntity)
                        .to.have.property("id")
                        .that.is.a("number")
                        .that.is.eql(expectedReportEntityId);

                    await expect(firstReportEntity)
                        .to.have.property("date")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityDate);

                    await expect(firstReportEntity)
                        .to.have.property("className")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityClassName);

                    await expect(firstReportEntity)
                        .to.have.property("classRoleName")
                        .that.is.a("string")
                        .that.is.eql(expectedReportEntityClassRoleName);

                    await expect(firstReportEntity)
                        .to.have.property("hoursSpend")
                        .that.is.a("number")
                        .that.is.eql(expectedReportEntityHoursSpend);

                    await expect(firstReportEntity)
                        .to.have.property("description")
                        .that.is.a("null")
                        .that.is.eql(expectedReportEntityDescription);
                });
        });
    });
});
