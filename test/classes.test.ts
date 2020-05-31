import httpStatus from "http-status-codes";

import {database, expect, Request, server} from "./base";

import {HttpMethod} from "./httpMethods";

import {noTokenTest, wrongTokenTest} from "./commonTests";

import {ClassesRepository} from "../repositories/ClassesRepository";

const classesRepository: ClassesRepository = new ClassesRepository(database);

const CONTENT_TYPE_HEADING = process.env.CONTENT_TYPE_HEADING || "";
const DEFAULT_CONTENT_TYPE = process.env.DEFAULT_CONTENT_TYPE || "";
const TOKEN_HEADING = process.env.TOKEN_HEADING || "";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const EMPLOYEE_TOKEN = process.env.EMPLOYEE_TOKEN || "";
const CLASS_ID_ONE = +process.env.CLASS_ID_ONE! || 0;
const CLASS_ID_TWO = +process.env.CLASS_ID_TWO! || 0;
const CLASS_ID_ARCHIVED = +process.env.CLASS_ID_ARCHIVED! || 0;

const CLASSES_CONTROLLER_URL: string = "/classes";
const URL_WITH_PARAM = (id: number | string) => {
    return `${CLASSES_CONTROLLER_URL}/${id}`;
};

describe(`${CLASSES_CONTROLLER_URL} tests`, () => {
    describe(`POST ${CLASSES_CONTROLLER_URL} tests`, () => {

        noTokenTest(HttpMethod.Post, CLASSES_CONTROLLER_URL);
        wrongTokenTest(HttpMethod.Post, CLASSES_CONTROLLER_URL);

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
                .post(CLASSES_CONTROLLER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.CREATED);
                    await expect(response.body.data.success).to.eql(expectedSuccess);

                    return response.body.data.resourceId;
                })
                .then(async (id: number) => {
                    const response = await classesRepository.deleteById(id);
                    await expect(response).to.eql(expectedIsReportDeleted);
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
                .post(CLASSES_CONTROLLER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.FORBIDDEN);
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
                .post(CLASSES_CONTROLLER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.CREATED);
                    await expect(response.body.data.success).to.eql(expectedSuccess);

                    return response.body.data.resourceId;
                })
                .then(async (classId: number) => {
                    const response = await classesRepository.deleteById(classId);
                    await expect(response).to.eql(expectedSuccess);
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
                .post(CLASSES_CONTROLLER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(response.body.data.success).to.eql(expectedSuccess);
                    await expect(response.body.data.errors.length).to.eql(expectedErrors);
                });
        });
    });

    describe(`PUT ${CLASSES_CONTROLLER_URL}/{id}`, () => {

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
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.FORBIDDEN);
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
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.OK);
                    await expect(response.body.data.success).to.eql(expectedSuccess);
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
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data).to.have.property("success");
                    await expect(response.body.data).to.have.property("message");
                    await expect(response.body.data).to.have.property("errors");

                    await expect(response.body.data.success).to.be.a("boolean");
                    await expect(response.body.data.message).to.be.a("string");
                    await expect(response.body.data.errors).to.be.an("array");

                    await expect(response.body.data.success).to.eql(false);
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
                .then(async (response: any) => {
                    expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                    expect(response.body.data.success).to.eql(expectedSuccess);
                    expect(response.body.data).to.have.property(errorsPropHeading);
                });
        });
    });

    describe(`DELETE ${CLASSES_CONTROLLER_URL}/{id}`, () => {

        noTokenTest(HttpMethod.Delete, URL_WITH_PARAM(14));
        wrongTokenTest(HttpMethod.Delete, URL_WITH_PARAM(14));

        it("Should not archive the class. Provided token belongs to employee", () => {
            const idToSend: number = 14;

            return Request(server)
                .delete(URL_WITH_PARAM(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send()
                .then(async (response: any) => {
                    expect(response.status).to.eql(httpStatus.FORBIDDEN);
                });
        });

        it("Should not archive the class. Provided class ID does not exist", () => {
            const idToSend: number = 1499999999;

            return Request(server)
                .delete(URL_WITH_PARAM(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (response: any) => {
                    expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                });
        });

        it("Should not archive. Provided ID is not numeric", () => {
            const classIdToSend: string = "15a";

            return Request(server)
                .put(URL_WITH_PARAM(classIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data).to.have.property("success");
                    await expect(response.body.data).to.have.property("message");
                    await expect(response.body.data).to.have.property("errors");

                    await expect(response.body.data.success).to.be.a("boolean");
                    await expect(response.body.data.message).to.be.a("string");
                    await expect(response.body.data.errors).to.be.an("array");

                    await expect(response.body.data.success).to.eql(false);
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
                .then(async (response: any) => {
                    expect(response.status).to.eql(httpStatus.OK);
                    expect(response.body.data.success).to.eql(expectedSuccess);
                });
        });
    });

    describe(`GET ${CLASSES_CONTROLLER_URL}`, () => {

        noTokenTest(HttpMethod.Get, CLASSES_CONTROLLER_URL);
        wrongTokenTest(HttpMethod.Get, CLASSES_CONTROLLER_URL);

        it("Should return all available non-archived classes", () => {

            const expectedCount: number = 19;
            const expectedId: number = 28;
            const expectedName: string = "Scratch games";
            const expectedAgeGroup: string = "2 - 3 grade";
            const expectedDescription = null;

            return Request(server)
                .get(CLASSES_CONTROLLER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, EMPLOYEE_TOKEN)
                .send()
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.OK);

                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data)
                        .to.have.property("count")
                        .that.is.a("number")
                        .that.eql(expectedCount);

                    await expect(response.body.data)
                        .to.have.property("classes")
                        .that.is.an("array")
                        .that.has.lengthOf(expectedCount);

                    const secondClass = response.body.data.classes[1];

                    await expect(secondClass)
                        .to.have.property("id")
                        .that.is.a("number")
                        .that.eql(expectedId);

                    await expect(secondClass)
                        .to.have.property("name")
                        .that.is.a("string")
                        .that.eql(expectedName);

                    await expect(secondClass)
                        .to.have.property("ageGroup")
                        .that.is.a("string")
                        .that.eql(expectedAgeGroup);

                    await expect(secondClass)
                        .to.have.property("description")
                        .that.is.a("null")
                        .that.eql(expectedDescription);
                });
        });
    });

    describe(`GET ${CLASSES_CONTROLLER_URL}/id tests`, () => {

        noTokenTest(HttpMethod.Get, URL_WITH_PARAM(1));
        wrongTokenTest(HttpMethod.Get, URL_WITH_PARAM(1));

        it("Should return requested Class. Success test No. 1", () => {
            const classId: number = CLASS_ID_ONE;
            const expectedName: string = "Micro:bit";
            const expectedIsArchived: boolean = false;

            return Request(server)
                .get(URL_WITH_PARAM(classId))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.OK);

                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data)
                        .to.have.property("id")
                        .that.is.a("number")
                        .that.is.eql(classId);

                    await expect(response.body.data)
                        .to.have.property("name")
                        .that.is.a("string")
                        .that.is.eql(expectedName);

                    await expect(response.body.data)
                        .to.have.property("ageGroup")
                        .that.is.a("null");

                    await expect(response.body.data)
                        .to.have.property("description")
                        .that.is.a("null");

                    await expect(response.body.data)
                        .to.have.property("isArchived")
                        .that.is.a("boolean")
                        .that.is.eql(expectedIsArchived);
                });
        });

        it("Should return requested Class. Success test No. 2", () => {
            const classId: number = CLASS_ID_TWO;
            const expectedName: string = "Scratch games";
            const expectedAgeGroup: string = "2 - 3 grade";
            const expectedIsArchived: boolean = false;

            return Request(server)
                .get(URL_WITH_PARAM(classId))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.OK);

                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data)
                        .to.have.property("id")
                        .that.is.a("number")
                        .that.is.eql(classId);

                    await expect(response.body.data)
                        .to.have.property("name")
                        .that.is.a("string")
                        .that.is.eql(expectedName);

                    await expect(response.body.data)
                        .to.have.property("ageGroup")
                        .that.is.a("string")
                        .that.is.eql(expectedAgeGroup);

                    await expect(response.body.data)
                        .to.have.property("description")
                        .that.is.a("null");

                    await expect(response.body.data)
                        .to.have.property("isArchived")
                        .that.is.a("boolean")
                        .that.is.eql(expectedIsArchived);
                });
        });

        it("Should return requested Class. Success test No. 3", () => {
            const classId: number = CLASS_ID_ARCHIVED;
            const expectedName: string = "HTML and CSS";
            const expectedAgeGroup: string = "4-6";
            const expectedIsArchived: boolean = true;

            return Request(server)
                .get(URL_WITH_PARAM(classId))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.OK);

                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data)
                        .to.have.property("id")
                        .that.is.a("number")
                        .that.is.eql(classId);

                    await expect(response.body.data)
                        .to.have.property("name")
                        .that.is.a("string")
                        .that.is.eql(expectedName);

                    await expect(response.body.data)
                        .to.have.property("ageGroup")
                        .that.is.a("string")
                        .that.is.eql(expectedAgeGroup);

                    await expect(response.body.data)
                        .to.have.property("description")
                        .that.is.a("null");

                    await expect(response.body.data)
                        .to.have.property("isArchived")
                        .that.is.a("boolean")
                        .that.is.eql(expectedIsArchived);
                });
        });

        it("Should fail. Provided ID is not numeric", () => {
            const idToSend: string = "14as";

            return Request(server)
                .get(URL_WITH_PARAM(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);

                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data)
                        .to.have.property("error")
                        .that.is.a("string");
                });
        });

        it("Should not pass. Provided ID does not exist", () => {
            const idToSend: number = 0;

            return Request(server)
                .get(URL_WITH_PARAM(idToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);

                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data)
                        .to.have.property("error")
                        .that.is.a("string");
                });
        });
    });
});
