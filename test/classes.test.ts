const {
    server,
    database,
    expect,
    Request,
    CONTENT_TYPE_HEADING,
    DEFAULT_CONTENT_TYPE,
    TOKEN_HEADING,
    token
} = require("./base");

const {
    noTokenTest,
    wrongTokenTest
} = require("./commonTests");

import { ClassesModel } from "../models/ClassesModel";

const classesModel: ClassesModel = new ClassesModel(database);

const CLASSES_CONTROLLER_URL: string = "/classes";
const CREATE_URL: string = `${CLASSES_CONTROLLER_URL}`;
const EDIT_URL = (id: number) => {
    return `${CLASSES_CONTROLLER_URL}/${id}`;
};
const ARCHIVE_URL = (id: number) => {
    return `${CLASSES_CONTROLLER_URL}/${id}`;
};

describe(`${CLASSES_CONTROLLER_URL} tests`, () => {
    describe(`POST ${CREATE_URL} tests`, () => {
        noTokenTest(CREATE_URL);
        wrongTokenTest(CREATE_URL);

        it(`Should add a new class. Should delete it after the test finishes.`, () => {
            const nameToSend: string = "Scratch games";
            const ageGroupToSend: string = "2 - 3 grade";

            const objectToSend = {
                name: nameToSend,
                ageGroup: ageGroupToSend
            };

            const expectedHttpStatus: number = 201;
            const expectedSuccess: boolean = true;
            const expectedIsReportDeleted: boolean = true;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(expectedHttpStatus);
                    await expect(result.body.data.success).to.eql(expectedSuccess);

                    return result.body.data.classId;
                })
                .then(async (id: number) => {
                    const result = await classesModel.deleteById(id);
                    await expect(result).to.eql(expectedIsReportDeleted);
                });
        });

        it(`Should add a new classes. Field 'ageGroup' is not defined.
            Should delete the record after the test finishes.`, () => {
            const nameToSend: string = "Micro:bit";

            const objectToSend = {
                name: nameToSend
            };

            const expectedStatus: number = 201;
            const expectedSuccess: boolean = true;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(expectedStatus);
                    await expect(result.body.data.success).to.eql(expectedSuccess);

                    return result.body.data.classId;
                })
                .then(async (classId: number) => {
                    const result = await classesModel.deleteById(classId);
                    await expect(result).to.eql(expectedSuccess);
                });
        });

        it(`Should not add a new class. Field 'name' is not defined.`, () => {
            const ageGroupToSend: string = "4-6 Grade";

            const objectToSend = {
                ageGroup: ageGroupToSend
            };

            const expectedStatus: number = 400;
            const expectedSuccess: boolean = false;
            const expectedErrors: number = 1;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(expectedStatus);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.errors.length).to.eql(expectedErrors);
                });
        });
    });
});
