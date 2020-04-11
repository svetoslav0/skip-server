const {
    server,
    database,
    expect,
    Request,
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

import { ClassRolesModel } from "../models/ClassRolesModel";

const classRolesModel: ClassRolesModel = new ClassRolesModel(database);

const CLASS_ROLES_CONTROLLER_URL: string = "/classRoles";
const CREATE_URL: string = `${CLASS_ROLES_CONTROLLER_URL}`;
const EDIT_URL = (id: number) => {
    return `${CLASS_ROLES_CONTROLLER_URL}/${id}`;
};
const ARCHIVE_URL = (id: number) => {
    return `${CLASS_ROLES_CONTROLLER_URL}/${id}`;
};

describe(`${CLASS_ROLES_CONTROLLER_URL} tests`, () => {
    describe(`POST ${CREATE_URL} tests`, () => {

        it("Should add a row (Test No. 1)", () => {
            const nameToSend: string = "Lecturer";
            const paymentToSend: number = 20;

            const objectToSend = {
                name: nameToSend,
                paymentPerHour: paymentToSend
            };

            const expectedSuccess: boolean = true;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);

                    await expect(result).to.have.property("body");
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("classRoleId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");
                    await expect(result.body.data).not.to.have.property("error");
                    await expect(result.body.data).not.to.have.property("errors");

                    await expect(result.body.data.classRoleId).to.be.a("number");
                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    return result.body.data.classRoleId;
                })
                .then(async (classRoleId: number) => {
                    const result: boolean = await classRolesModel.deleteById(classRoleId);
                    await expect(result).to.eql(true);
                });
        });

        it("Should add a row (Test No. 2)", () => {
            const nameToSend: string = "Co-Lecturer";
            const paymentToSend: number = 12;

            const objectToSend = {
                name: nameToSend,
                paymentPerHour: paymentToSend
            };

            const expectedSuccess: boolean = true;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);

                    await expect(result).to.have.property("body");
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("classRoleId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");
                    await expect(result.body.data).not.to.have.property("error");
                    await expect(result.body.data).not.to.have.property("errors");

                    await expect(result.body.data.classRoleId).to.be.a("number");
                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(expectedSuccess);

                    return result.body.data.classRoleId;
                })
                .then(async (classRoleId: number) => {
                    const result: boolean = await classRolesModel.deleteById(classRoleId);
                    await expect(result).to.eql(true);
                });
        });

        it("Should add a row (Test No. 3)", () => {
            const nameToSend: string = "Watcher";
            const paymentToSend: number = 6;

            const objectToSend = {
                name: nameToSend,
                paymentPerHour: paymentToSend
            };

            const expectedSuccess: boolean = true;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);

                    await expect(result).to.have.property("body");
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("classRoleId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");
                    await expect(result.body.data).not.to.have.property("error");
                    await expect(result.body.data).not.to.have.property("errors");

                    await expect(result.body.data.classRoleId).to.be.a("number");
                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(expectedSuccess);

                    return result.body.data.classRoleId;
                })
                .then(async (classRoleId: any) => {
                    const result: boolean = await classRolesModel.deleteById(classRoleId);
                    await expect(result).to.eql(true);
                });
        });

        it("Should add a row (Test No. 4)", () => {
            const nameToSend: string = "Other";
            const paymentToSend: number = 0;

            const objectToSend = {
                name: nameToSend,
                paymentPerHour: paymentToSend
            };

            const expectedSuccess: boolean = true;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);

                    await expect(result).to.have.property("body");
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("classRoleId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");
                    await expect(result.body.data).not.to.have.property("error");
                    await expect(result.body.data).not.to.have.property("errors");

                    await expect(result.body.data.classRoleId).to.be.a("number");
                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(expectedSuccess);

                    return result.body.data.classRoleId;
                })
                .then(async (classRoleId: any) => {
                    const result: boolean = await classRolesModel.deleteById(classRoleId);
                    await expect(result).to.eql(true);
                });
        });

        noTokenTestPost(CREATE_URL);
        wrongTokenTestPost(CREATE_URL);

        it("Should not add a row. Provided token belongs to employee", () => {
            const nameToSend: string = "Lecturer";
            const paymentToSend: number = 20;

            const objectToSend = {
                name: nameToSend,
                paymentPerHour: paymentToSend
            };

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, employeeToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    expect(result.status).to.eql(httpStatus.FORBIDDEN);

                    expect(result).to.have.property("body");
                    expect(result.body).to.have.property("data");
                    expect(result.body.data).to.have.property("error");
                    expect(result.body.data).to.have.property("message");

                    expect(result.body.data.error).to.be.a("string");
                    expect(result.body.data.message).to.be.a("string");
                });
        });

        it("Should not add a row. Field 'name' is missing", () => {
            const paymentToSend: number = 20;

            const objectToSend = {
                paymentPerHour: paymentToSend
            };

            const expectedSuccess: boolean = false;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    expect(result.status).to.eql(httpStatus.BAD_REQUEST);

                    expect(result).to.have.property("body");
                    expect(result.body).to.have.property("data");
                    expect(result.body.data).to.have.property("success");
                    expect(result.body.data).to.have.property("message");
                    expect(result.body.data).to.have.property("errors");

                    expect(result.body.data.success).to.be.a("boolean");
                    expect(result.body.data.message).to.be.a("string");
                    expect(result.body.data.errors).to.be.an("array");

                    expect(result.body.data.success).to.eql(expectedSuccess);
                });
        });

        it("Should not add a row. Field 'paymentPerHour' is missing", () => {
            const nameToSend: string = "Lecturer";

            const objectToSend = {
                name: nameToSend
            };

            const expectedSuccess: boolean = false;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    expect(result.status).to.eql(httpStatus.BAD_REQUEST);

                    expect(result).to.have.property("body");
                    expect(result.body).to.have.property("data");
                    expect(result.body.data).to.have.property("success");
                    expect(result.body.data).to.have.property("message");
                    expect(result.body.data).to.have.property("errors");

                    expect(result.body.data.success).to.be.a("boolean");
                    expect(result.body.data.message).to.be.a("string");
                    expect(result.body.data.errors).to.be.an("array");

                    expect(result.body.data.success).to.eql(expectedSuccess);
                });
        });

        it("Should not add a row. Field 'paymentPerHour' is not a number", () => {
            const paymentToSend: string = "Not a number";

            const objectToSend = {
                paymentPerHour: paymentToSend
            };

            const expectedSuccess: boolean = false;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    expect(result.status).to.eql(httpStatus.BAD_REQUEST);

                    expect(result).to.have.property("body");
                    expect(result.body).to.have.property("data");
                    expect(result.body.data).to.have.property("success");
                    expect(result.body.data).to.have.property("message");
                    expect(result.body.data).to.have.property("errors");

                    expect(result.body.data.success).to.be.a("boolean");
                    expect(result.body.data.message).to.be.a("string");
                    expect(result.body.data.errors).to.be.an("array");

                    expect(result.body.data.success).to.eql(expectedSuccess);
                });
        });

        it("Should not add a row. Field 'paymentPerHour' is a number but its negative", () => {
            const paymentToSend: number = -15;

            const objectToSend = {
                paymentPerHour: paymentToSend
            };

            const expectedSuccess: boolean = false;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, adminToken)
                .send(objectToSend)
                .then(async (result: any) => {
                    expect(result.status).to.eql(httpStatus.BAD_REQUEST);

                    expect(result).to.have.property("body");
                    expect(result.body).to.have.property("data");
                    expect(result.body.data).to.have.property("success");
                    expect(result.body.data).to.have.property("message");
                    expect(result.body.data).to.have.property("errors");

                    expect(result.body.data.success).to.be.a("boolean");
                    expect(result.body.data.message).to.be.a("string");
                    expect(result.body.data.errors).to.be.an("array");

                    expect(result.body.data.success).to.eql(expectedSuccess);
                });
        });
    });
});
