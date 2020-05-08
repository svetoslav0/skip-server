const {
    server,
    database,
    expect,
    CONTENT_TYPE_HEADING,
    DEFAULT_CONTENT_TYPE,
    TOKEN_HEADING,
    adminToken,
    employeeToken
} = require("./base");

import httpStatus from "http-status-codes";

const {
    noTokenTestPost,
    wrongTokenTestPost,
    noTokenTestPut,
    wrongTokenTestPut,
    noTokenTestDelete,
    wrongTokenTestDelete
} = require("./commonTests");

import { ReportEntitiesRepository } from "../repositories/ReportEntitiesRepository";

import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);

const request = chai.request;

const reportEntitiesRepository: ReportEntitiesRepository = new ReportEntitiesRepository(database);

const REPORT_ENTITIES_CONTROLLER_URL: string = "/reportEntities";
const CREATE_URL: string = `${REPORT_ENTITIES_CONTROLLER_URL}`;
const EDIT_URL = (id: number | string) => {
    return `${REPORT_ENTITIES_CONTROLLER_URL}/${id}`;
};
const DELETE_URL = (id: number | string) => {
    return `${REPORT_ENTITIES_CONTROLLER_URL}/${id}`;
};
const ARCHIVE_URL = (id: number) => {
    return `${REPORT_ENTITIES_CONTROLLER_URL}/${id}`;
};

const existingClassRoleIdOne: number = 3;
const existingClassRoleIdTwo: number = 74;
const existingClassIdOne: number = 14;
const existingClassIdTwo: number = 19;
const existingReportIdOne: number = 13;
const existingReportEntityOne: number = 38;
const existingReportEntityTwo: number = 57;
const existingReportEntityThree: number = 62;

// User ID of entity 62, its role is employee
const ownerOfReportEntityThree: number = 137;

const nonExistingClassRoleId: number = 99999999;
const nonExistingClassId: number = 99999998;
const nonExistingReportId: number = 99999997;
const nonExistingReportEntityOne: number = 1;
const nonExistingReportEntityTwo: number = 2;

describe(`${REPORT_ENTITIES_CONTROLLER_URL} tests`, () => {
    describe(`POST ${CREATE_URL}`, () => {

        noTokenTestPost(CREATE_URL);
        wrongTokenTestPost(CREATE_URL);

        it("Should add report entity. Test No. 1", () => {
            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2017/01/13";

            const objectToSend = {
                classRoleId: existingClassRoleIdOne,
                classId: existingClassIdOne,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);

                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("resourceId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");

                    await expect(result.body.data.resourceId).to.be.a("number");
                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(true);

                    return result.body.data.resourceId;
                })
                .then(async (reportEntityId: number) => {
                    const isDeleted: boolean = await reportEntitiesRepository.deleteById(reportEntityId);
                    await expect(isDeleted).to.eql(true);
                });
        });

        it("Should add report entity. Test No. 2", () => {
            const hoursSpendToSend: number = 4;
            const dateToSend: string = "2020/05/18";

            const objectToSend = {
                classRoleId: existingClassRoleIdTwo,
                classId: existingClassIdTwo,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
                reportId: existingReportIdOne,
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);

                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("resourceId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");

                    await expect(result.body.data.resourceId).to.be.a("number");
                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(true);

                    return result.body.data.resourceId;
                })
                .then(async (reportEntityId: number) => {
                    const isDeleted: boolean = await reportEntitiesRepository.deleteById(reportEntityId);
                    await expect(isDeleted).to.eql(true);
                });
        });

        it("Should not add report entity. Class Role ID is not provided.", () => {
            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2020/05/18";

            const objectToSend = {
                classId: existingClassIdTwo,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
                reportId: existingReportIdOne
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

        it("Should not add report entity. Class Role ID is provided, " +
            "but is not numeric", () => {

            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2020/05/18";

            const objectToSend = {
                classRoleId: "15a",
                classId: existingClassIdTwo,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
                reportId: existingReportIdOne
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

        it("Should not add report entity. Class Role ID is provided, " +
            "but does not correspond to an existing record on the database", () => {

            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2020/05/18";

            const objectToSend = {
                classRoleId: nonExistingClassRoleId,
                classId: existingClassIdTwo,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
                reportId: existingReportIdOne
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

        it("Should not add report entity. Class ID is not provided.", () => {

            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2020/05/18";

            const objectToSend = {
                classRoleId: existingClassRoleIdTwo,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
                reportId: existingReportIdOne
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

        it("Should not add report entity. Class ID is provided, " +
            "but does not correspond to an existing record on the database", () => {

            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2020/05/18";

            const objectToSend = {
                classRoleId: existingClassRoleIdTwo,
                classId: nonExistingClassId,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
                reportId: existingReportIdOne
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

        it("Should not add report entity. Class ID is provided, " +
            "but is not numeric", () => {

            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2020/05/18";
            const classIdToSend: string = "15a";

            const objectToSend = {
                classRoleId: existingClassRoleIdTwo,
                classId: classIdToSend,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
                reportId: existingReportIdOne
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

        it("Should not add report entity. Filed 'hoursSpend' is not provided", () => {
            const dateToSend: string = "2019/05/18";

            const objectToSend = {
                classRoleId: existingClassRoleIdOne,
                classId: existingClassIdTwo,
                date: dateToSend,
                reportId: existingReportIdOne
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

        it("Should not add report entity. Filed 'hoursSpend' is provided, " +
            "but is not numeric", () => {

            const hoursSpendToSend: string = "2a";
            const dateToSend: string = "2020/05/18";

            const objectToSend = {
                classRoleId: existingClassRoleIdTwo,
                classId: existingClassIdTwo,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
                reportId: existingReportIdOne
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

        it("Should not add report entity. Filed 'hoursSpend' is provided, " +
            "but is not positive number", () => {

            const hoursSpendToSend: number = -2;
            const dateToSend: string = "2018/05/18";

            const objectToSend = {
                classRoleId: existingClassRoleIdTwo,
                classId: existingClassIdTwo,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
                reportId: existingReportIdOne
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

        it("Should not add report entity. Field 'date' is not provided", () => {

            const hoursSpendToSend: number = 2;

            const objectToSend = {
                classRoleId: existingClassRoleIdTwo,
                classId: existingClassIdOne,
                hoursSpend: hoursSpendToSend,
                reportId: existingReportIdOne
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

        it("Should not add report entity. Field 'date' is provided, but is in wrong format", () => {

            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2020/05/182";

            const objectToSend = {
                classRoleId: existingClassRoleIdOne,
                classId: existingClassIdTwo,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
                reportId: existingReportIdOne
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

        it("Should not add report entity. Provided Report ID does not correspond to an existing row.", () => {

            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2020/05/18";

            const objectToSend = {
                classRoleId: existingClassRoleIdOne,
                classId: existingClassIdTwo,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
                reportId: nonExistingReportId
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

        it("Should not add report entity. Provided Report ID is not numeric", () => {

            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2020/05/18";
            const reportIdToSend: string = "15a";

            const objectToSend = {
                classRoleId: existingClassRoleIdOne,
                classId: existingClassIdTwo,
                hoursSpend: hoursSpendToSend,
                date: dateToSend,
                reportId: reportIdToSend
            };

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
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

    describe(`PUT ${REPORT_ENTITIES_CONTROLLER_URL}/{id} tests`, () => {

        noTokenTestPut(EDIT_URL(existingReportEntityOne));
        wrongTokenTestPut(EDIT_URL(existingReportEntityTwo));

        it("Should update report entity. Test No. 1", () => {
            const hoursToSend: number = 3;

            const objectToSend = {
                classRoleId: existingClassRoleIdOne,
                classId: existingClassIdOne,
                hoursSpend: hoursToSend
            };

            return request(server)
                .put(EDIT_URL(existingReportEntityTwo))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);

                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("resourceId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");

                    await expect(result.body.data.resourceId).to.be.a("number");
                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(true);
                });
        });

        it("Should update report entity. Test No. 2", () => {
            const hoursToSend: number = 1;
            const dateToSend: string = "2020/05/13";

            const objectToSend = {
                classRoleId: existingClassRoleIdTwo,
                hoursSpend: hoursToSend,
                date: dateToSend,
                reportId: existingReportIdOne
            };

            return request(server)
                .put(EDIT_URL(existingReportEntityThree))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);

                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("resourceId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");

                    await expect(result.body.data.resourceId).to.be.a("number");
                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(true);
                });
        });

        it("Should not update the report entity. Provided ID is not numeric", () => {
            const hoursToSend: number = 3;
            const idToSend: string = "adw3aw";

            const objectToSend = {
                classRoleId: existingClassRoleIdOne,
                hoursSpend: hoursToSend
            };

            return request(server)
                .put(EDIT_URL(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
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

        it("Should not update the report entity. Provided ID is not existing", () => {

            const dateToSend: string = "2019/03/12";
            const idToSend: number = nonExistingReportEntityOne;

            const objectToSend = {
                classRoleId: existingClassRoleIdOne,
                date: dateToSend
            };

            return request(server)
                .put(EDIT_URL(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
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

        it("Should not update the report entity. Field 'classId' is provided but not numeric.", () => {
            const dateToSend: string = "2019/03/12";
            const classIdToSend: string = "38a";

            const objectToSend = {
                date: dateToSend,
                classId: classIdToSend
            };

            return request(server)
                .put(EDIT_URL(existingReportEntityThree))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
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

        it("Should not update the report entity. Field 'classId' is provided but not existing.", () => {

            const dateToSend: string = "2019/03/12";

            const objectToSend = {
                date: dateToSend,
                classId: nonExistingClassId
            };

            return request(server)
                .put(EDIT_URL(existingReportEntityThree))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
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

        it("Should not update the report entity. Field 'classRoleId' is provided but not numeric.", () => {
            const hourToSend: number = 1;
            const classRoleIdToSend: string = "31b";

            const objectToSend = {
                hoursSpend: hourToSend,
                classRoleId: classRoleIdToSend
            };

            return request(server)
                .put(EDIT_URL(existingReportEntityThree))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
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

        it("Should not update the report entity. Field 'classRoleId' is provided but not existing.", () => {
            const objectToSend = {
                reportId: existingReportIdOne,
                classRoleId: nonExistingClassRoleId
            };

            return request(server)
                .put(EDIT_URL(existingReportEntityThree))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
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

        it("Should not update the report entity. Field 'hoursSpend' is provided but not numeric.", () => {
            const hourToSend: string = "wawdasa";

            const objectToSend = {
                hoursSpend: hourToSend,
                classRoleId: existingClassRoleIdTwo
            };

            return request(server)
                .put(EDIT_URL(existingReportEntityThree))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
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

        it("Should not update the report entity. Field 'hoursSpend' is provided but is negative.", () => {

            const hourToSend: number = -2;

            const objectToSend = {
                hoursSpend: hourToSend,
                classRoleId: existingClassRoleIdTwo
            };

            return request(server)
                .put(EDIT_URL(existingReportEntityThree))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
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

        it("Should not update the report entity. Field 'reportId' is provided but not numeric.", () => {
            const hourToSend: number = 2;
            const reportIdToSend: string = "13qw";

            const objectToSend = {
                hoursSpend: hourToSend,
                reportId: reportIdToSend
            };

            return request(server)
                .put(EDIT_URL(existingReportEntityThree))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
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

        it("Should not update the report entity. Field 'reportId' is provided but not existing.", () => {
            const objectToSend = {
                classId: existingClassIdOne,
                reportId: nonExistingReportId
            };

            return request(server)
                .put(EDIT_URL(existingReportEntityThree))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
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

        it("Should not update the report entity. Field 'date' is not valid", () => {
            const dateToSend: string = "2020/19/18";

            const objectToSend = {
                classId: existingClassIdTwo,
                date: dateToSend
            };

            return request(server)
                .put(EDIT_URL(existingReportEntityThree))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
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

    describe(`DELETE ${REPORT_ENTITIES_CONTROLLER_URL}/{id} tests`, () => {

        noTokenTestDelete(DELETE_URL(existingReportEntityOne));
        wrongTokenTestDelete(DELETE_URL(existingReportEntityOne));

        it("Should archive the entity. Test No. 1", () => {

        });

        it("Should archive the entity. Test No. 2", () => {

        });

        it("Should not archive the entity. The provided ID is not numeric", () => {

        });

        it("Should not archive the entity. The provided ID does not exist", () => {

        });

        
    });
});
