import httpStatus from "http-status-codes";

import { server, database, expect, Request } from "./base";
import { HttpMethod } from "./httpMethods";

import {
    noTokenTest,
    wrongTokenTest
} from "./commonTests";

import { ClassRolesRepository } from "../repositories/ClassRolesRepository";

const classRolesRepository: ClassRolesRepository = new ClassRolesRepository(database);

const CONTENT_TYPE_HEADING = process.env.CONTENT_TYPE_HEADING || "";
const DEFAULT_CONTENT_TYPE = process.env.DEFAULT_CONTENT_TYPE || "";
const TOKEN_HEADING = process.env.TOKEN_HEADING || "";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const EMPLOYEE_TOKEN = process.env.EMPLOYEE_TOKEN || "";

const CLASS_ROLES_CONTROLLER_URL: string = "/classRoles";
const CREATE_URL: string = `${CLASS_ROLES_CONTROLLER_URL}`;
const URL_WITH_PARAM = (id: number | string) => {
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
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);

                    await expect(result).to.have.property("body");
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("resourceId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");
                    await expect(result.body.data).not.to.have.property("error");
                    await expect(result.body.data).not.to.have.property("errors");

                    await expect(result.body.data.resourceId).to.be.a("number");
                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    return result.body.data.resourceId;
                })
                .then(async (classRoleId: number) => {
                    const result: boolean = await classRolesRepository.deleteById(classRoleId);
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
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);

                    await expect(result).to.have.property("body");
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("resourceId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");
                    await expect(result.body.data).not.to.have.property("error");
                    await expect(result.body.data).not.to.have.property("errors");

                    await expect(result.body.data.resourceId).to.be.a("number");
                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(expectedSuccess);

                    return result.body.data.resourceId;
                })
                .then(async (classRoleId: number) => {
                    const result: boolean = await classRolesRepository.deleteById(classRoleId);
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
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);

                    await expect(result).to.have.property("body");
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("resourceId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");
                    await expect(result.body.data).not.to.have.property("error");
                    await expect(result.body.data).not.to.have.property("errors");

                    await expect(result.body.data.resourceId).to.be.a("number");
                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(expectedSuccess);

                    return result.body.data.resourceId;
                })
                .then(async (classRoleId: any) => {
                    const result: boolean = await classRolesRepository.deleteById(classRoleId);
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
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);

                    await expect(result).to.have.property("body");
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("resourceId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");
                    await expect(result.body.data).not.to.have.property("error");
                    await expect(result.body.data).not.to.have.property("errors");

                    await expect(result.body.data.resourceId).to.be.a("number");
                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(expectedSuccess);

                    return result.body.data.resourceId;
                })
                .then(async (classRoleId: any) => {
                    const result: boolean = await classRolesRepository.deleteById(classRoleId);
                    await expect(result).to.eql(true);
                });
        });

        noTokenTest(HttpMethod.Post, CREATE_URL);
        wrongTokenTest(HttpMethod.Post, CREATE_URL);

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
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
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
                .set(TOKEN_HEADING, ADMIN_TOKEN)
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
                .set(TOKEN_HEADING, ADMIN_TOKEN)
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
                .set(TOKEN_HEADING, ADMIN_TOKEN)
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
                .set(TOKEN_HEADING, ADMIN_TOKEN)
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

    describe(`PUT ${CLASS_ROLES_CONTROLLER_URL}/{id} tests`, () => {

        noTokenTest(HttpMethod.Put, URL_WITH_PARAM(24));
        wrongTokenTest(HttpMethod.Put, URL_WITH_PARAM(24));

        it("Should update the class role", () => {
            const nameToSend: string = "Lecturer";
            const paymentToSend: number = 15;
            const classRoleIdToSend: number = 3;

            const objectToSend = {
                name: nameToSend,
                paymentPerHour: paymentToSend
            };

            return Request(server)
                .put(URL_WITH_PARAM(classRoleIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("resourceId");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");

                    await expect(result.body.data.success).to.eql(true);
                    await expect(result.body.data.resourceId).to.eql(classRoleIdToSend);
                });
        });

        it("Should not update the class role. Provided token belongs to employee", () => {
            const nameToSend = "Co-Lecturer";
            const classRoleIdToSend: number = 3;

            const objectToSend = {
                name: nameToSend
            };

            return Request(server)
                .put(URL_WITH_PARAM(classRoleIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.FORBIDDEN);
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("error");
                    await expect(result.body.data).to.have.property("message");

                    await expect(result.body.data.error).to.be.a("string");
                    await expect(result.body.data.message).to.be.a("string");
                });
        });

        it("Should not update the class role. Provided ID is not numeric", () => {
            const nameToSend: string = "Observer";
            const classRoleIdToSend: string = "3a";

            const objectToSend = {
                name: nameToSend
            };

            return Request(server)
                .put(URL_WITH_PARAM(classRoleIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
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
                });
        });

        it("Should not update the class role. Provided ID does not exist", () => {
            const paymentToSend: number = 21;
            const classRoleIdToSend: number = 9999999999;

            const objectToSend = {
                paymentPerHour: paymentToSend
            };

            return Request(server)
                .put(URL_WITH_PARAM(classRoleIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
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

        it("Should not update the class role. Field 'paymentPerHour' is not numeric", () => {
            const paymentToSend: string = "150aa";
            const classRoleIdToSend: number = 3;

            const objectToSend = {
                paymentPerHour: paymentToSend
            };

            return Request(server)
                .put(URL_WITH_PARAM(classRoleIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
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

        it("Should not update the class role. Field 'paymentPerHour' is negative number", () => {
            const paymentToSend: number = -15;
            const classRoleIdToSend: number = 3;

            const objectToSend = {
                paymentPerHour: paymentToSend
            };

            return Request(server)
                .put(URL_WITH_PARAM(classRoleIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
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

    describe(`DELETE ${CLASS_ROLES_CONTROLLER_URL}/{id} tests`, () => {

        noTokenTest(HttpMethod.Delete, URL_WITH_PARAM(24));
        wrongTokenTest(HttpMethod.Delete, URL_WITH_PARAM(24));

        it("Should archive the class role", () => {
            const idToSend: number = 3;

            return Request(server)
                .delete(URL_WITH_PARAM(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);
                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("success");
                    await expect(result.body.data).to.have.property("message");

                    await expect(result.body.data.success).to.be.a("boolean");
                    await expect(result.body.data.message).to.be.a("string");

                    await expect(result.body.data.success).to.eql(true);
                });
        });

        it("Should not archive. Provided ID is not numeric", () => {
            const idToSend: string = "3A";

            return Request(server)
                .delete(URL_WITH_PARAM(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
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

        it("Should not archive. Provided ID does not exist", () => {
            const idToSend: number = 91231341923;

            return Request(server)
                .delete(URL_WITH_PARAM(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
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

        it("Should not archive. Provided token belongs to employee", () => {
            const idToSend: number = 3;

            return Request(server)
                .delete(URL_WITH_PARAM(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.FORBIDDEN);

                    await expect(result.body).to.have.property("data");
                    await expect(result.body.data).to.have.property("error");
                    await expect(result.body.data).to.have.property("message");

                    await expect(result.body.data.error).to.be.an("string");
                    await expect(result.body.data.message).to.be.a("string");
                });
        });
    });
});
