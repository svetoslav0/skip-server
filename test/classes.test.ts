import httpStatus from "http-status-codes";

import { server, database, expect, Request } from "./base";
import { HttpMethod } from "./httpMethod";

import {
    noTokenTest,
    wrongTokenTest
} from "./commonTests";

import { ClassesRepository } from "../repositories/ClassesRepository";

const classesRepository: ClassesRepository = new ClassesRepository(database);

const CONTENT_TYPE_HEADING = process.env.CONTENT_TYPE_HEADING || "";
const DEFAULT_CONTENT_TYPE = process.env.DEFAULT_CONTENT_TYPE || "";
const TOKEN_HEADING = process.env.TOKEN_HEADING || "";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const EMPLOYEE_TOKEN = process.env.EMPLOYEE_TOKEN || "";

const CLASSES_CONTROLLER_URL: string = "/classes";
const CREATE_URL: string = `${CLASSES_CONTROLLER_URL}`;
const URL_WITH_PARAM = (id: number | string) => {
    return `${CLASSES_CONTROLLER_URL}/${id}`;
};

describe(`${CLASSES_CONTROLLER_URL} tests`, () => {
    describe(`POST ${CREATE_URL} tests`, () => {

        noTokenTest(HttpMethod.Post, CREATE_URL);
        wrongTokenTest(HttpMethod.Post, CREATE_URL);

        it(`Should add a new class. Should delete it after the test finishes`, () => {
            const nameToSend: string = "Scratch games";
            const ageGroupToSend: string = "2 - 3 grade";

            const objectToSend = {
                name: nameToSend,
                ageGroup: ageGroupToSend
            };

            const expectedSuccess: boolean = true;
            const expectedIsReportDeleted: boolean = true;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);
                    await expect(result.body.data.success).to.eql(expectedSuccess);

                    return result.body.data.resourceId;
                })
                .then(async (id: number) => {
                    const result = await classesRepository.deleteById(id);
                    await expect(result).to.eql(expectedIsReportDeleted);
                });
        });

        it(`Should not add a new class. Provided token belongs to employee`, () => {
            const nameToSend: string = "JavaScript games";
            const ageGroupToSend: string = "4 - 6 grade";

            const objectToSend = {
                name: nameToSend,
                ageGroup: ageGroupToSend
            };

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.FORBIDDEN);
                });
        });

        it(`Should add a new classes. Field 'ageGroup' is not defined.
            Should delete the record after the test finishes`, () => {
            const nameToSend: string = "Micro:bit";

            const objectToSend = {
                name: nameToSend
            };

            const expectedSuccess: boolean = true;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.CREATED);
                    await expect(result.body.data.success).to.eql(expectedSuccess);

                    return result.body.data.resourceId;
                })
                .then(async (classId: number) => {
                    const result = await classesRepository.deleteById(classId);
                    await expect(result).to.eql(expectedSuccess);
                });
        });

        it(`Should not add a new class. Field 'name' is not defined`, () => {
            const ageGroupToSend: string = "4-6 Grade";

            const objectToSend = {
                ageGroup: ageGroupToSend
            };

            const expectedSuccess: boolean = false;
            const expectedErrors: number = 1;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.errors.length).to.eql(expectedErrors);
                });
        });
    });

    describe(`PUT ${CREATE_URL}/{id}`, () => {

        noTokenTest(HttpMethod.Put, URL_WITH_PARAM(14));
        wrongTokenTest(HttpMethod.Put, URL_WITH_PARAM(14));

        it("Should not update. Provided token belongs to employee's account", () => {
            const nameToSend: string = "HTML";
            const classIdToSend: number = 14;

            const objectToSend = {
                name: nameToSend
            };

            return Request(server)
                .put(URL_WITH_PARAM(classIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.FORBIDDEN);
                });
        });

        it("Should update the class", () => {
            const nameToSend: string = "HTML and CSS";
            const classIdToSend: number = 14;

            const objectToSend = {
                name: nameToSend
            };

            const expectedSuccess: boolean = true;

            return Request(server)
                .put(URL_WITH_PARAM(classIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(httpStatus.OK);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                });
        });

        it("Should not update. Provided ID is not numeric", () => {
            const nameToSend: string = "Scratch";
            const classIdToSend: string = "14a";

            const objectToSend = {
                name: nameToSend
            };

            return Request(server)
                .put(URL_WITH_PARAM(classIdToSend))
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

        it("Should not update the class. Provided class ID does not exist", () => {
            const nameToSend: string = "JavaScript";
            const ageGroupToSend: string = "1 - 101 age";
            const classIdToSend: number = 98765432;

            const objectToSend = {
                name: nameToSend,
                ageGroup: ageGroupToSend
            };

            const expectedSuccess: boolean = false;
            const errorsPropHeading: string = "errors";

            return Request(server)
                .put(URL_WITH_PARAM(classIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (result: any) => {
                    expect(result.status).to.eql(httpStatus.BAD_REQUEST);
                    expect(result.body.data.success).to.eql(expectedSuccess);
                    expect(result.body.data).to.have.property(errorsPropHeading);
                });
        });
    });

    describe(`DELETE ${CREATE_URL}/{id}`, () => {

        noTokenTest(HttpMethod.Delete, URL_WITH_PARAM(14));
        wrongTokenTest(HttpMethod.Delete, URL_WITH_PARAM(14));

        it("Should not archive the class. Provided token belongs to employee", () => {
            const idToSend: number = 14;

            return Request(server)
                .delete(URL_WITH_PARAM(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send()
                .then(async (result: any) => {
                    expect(result.status).to.eql(httpStatus.FORBIDDEN);
                });
        });

        it("Should not archive the class. Provided class ID does not exist", () => {
            const idToSend: number = 1499999999;

            return Request(server)
                .delete(URL_WITH_PARAM(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (result: any) => {
                    expect(result.status).to.eql(httpStatus.BAD_REQUEST);
                });
        });

        it("Should not archive. Provided ID is not numeric", () => {
            const classIdToSend: string = "15a";

            return Request(server)
                .put(URL_WITH_PARAM(classIdToSend))
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

        it("Should archive the class.", () => {
            const idToSend: number = 14;

            const expectedSuccess: boolean = true;

            return Request(server)
                .delete(URL_WITH_PARAM(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (result: any) => {
                    expect(result.status).to.eql(httpStatus.OK);
                    expect(result.body.data.success).to.eql(expectedSuccess);
                });
        });
    });
});
