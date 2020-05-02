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

import { ReportEntitiesModel } from "../models/ReportEntitiesModel";


import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);

const request = chai.request;

const reportEntitiesModel: ReportEntitiesModel = new ReportEntitiesModel(database);

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
const existingUserId: number = 6;

const nonExistingClassRoleId: number = 99999999;
const nonExistingClassId: number = 99999998;
const nonExistingReportId: number = 99999997;
const nonExistingUserId: number = 7;

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
                userId: existingUserId
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
                    const isDeleted: boolean = await reportEntitiesModel.deleteById(reportEntityId);
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
                userId: existingUserId
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
                    const isDeleted: boolean = await reportEntitiesModel.deleteById(reportEntityId);
                    await expect(isDeleted).to.eql(true);
                });
        });

        it("Should not add report entity. Class Role ID is not provided.", () => {
            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2020/05/18";

            const objectToSend = {
                classId: existingClassIdTwo,
                userId: existingUserId,
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
                userId: existingUserId,
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
                userId: existingUserId,
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
                userId: existingUserId,
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
                userId: existingUserId,
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
                userId: existingUserId,
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

        it("Should not add report entity. User ID is not provided.", () => {
            const hoursSpendToSend: number = 2;
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

        it("Should not add report entity. User ID is provided, " +
            "but does not correspond to an existing record on the database", () => {

            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2020/05/18";

            const objectToSend = {
                classRoleId: existingClassRoleIdTwo,
                classId: existingClassIdTwo,
                userId: nonExistingUserId,
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

        it("Should not add report entity. User ID is provided, " +
            "but is not numeric", () => {

            const hoursSpendToSend: number = 2;
            const dateToSend: string = "2020/05/18";
            const userIdToSend: string = "15a";

            const objectToSend = {
                classRoleId: existingClassRoleIdTwo,
                classId: existingClassIdOne,
                userId: userIdToSend,
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
                userId: existingUserId,
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
                userId: existingUserId,
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
                userId: existingUserId,
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
                userId: existingUserId,
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
                userId: existingUserId,
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
                userId: existingUserId,
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
                userId: existingUserId,
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
});
