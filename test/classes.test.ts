process.env.ENVIRONMENT = "test";

import { server, database } from "../server";
import { ClassesModel } from "../models/ClassesModel";

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

import chai from "chai";
import chaiHttp from "chai-http";
import "mocha";

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

const classesModel: ClassesModel = new ClassesModel(database);

const DEFAULT_CONTENT_TYPE: string = "application/x-www-form-urlencoded";
const CONTENT_TYPE_HEADING: string = "content-type";
const TOKEN_HEADING: string = "auth-token";

const CLASSES_CONTROLLER_URL: string = "/classes";
const CREATE_URL: string = `${CLASSES_CONTROLLER_URL}`;
const EDIT_URL = (id: number) => {
    return `${CLASSES_CONTROLLER_URL}/${id}`;
};
const ARCHIVE_URL = (id: number) => {
    return `${CLASSES_CONTROLLER_URL}/${id}`;
};

const token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGVJZCI6MiwiaWF0IjoxNTg0Mjg2MjUzfQ.dUm6sU7RobQucIRH3Vf1C-tr2EgwL0gQ49xQ9CAPIqs";

describe(`${CLASSES_CONTROLLER_URL} tests`, () => {
    describe(`POST ${CREATE_URL} tests`, () => {
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

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result) => {
                    await expect(result.status).to.eql(expectedHttpStatus);
                    await expect(result.body.data.success).to.eql(expectedSuccess);

                    return result.body.data.classId;
                })
                .then(async (id) => {
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

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result) => {
                    await expect(result.status).to.eql(expectedStatus);
                    await expect(result.body.data.success).to.eql(expectedSuccess);

                    return result.body.data.classId;
                })
                .then(async (classId) => {
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

            return request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result) => {
                    await expect(result.status).to.eql(expectedStatus);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.errors.length).to.eql(expectedErrors);
                });
        });
    });
});
