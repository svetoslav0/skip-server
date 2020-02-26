process.env.ENVIRONMENT = "test";

import { server, database } from "../server";
import { UsersModel } from "../models/UsersModel";

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

import chai from "chai";
import chaiHttp from "chai-http";
import "mocha";

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

const usersModel: UsersModel = new UsersModel(database);

const DEFAULT_CONTENT_TYPE: string = "application/x-www-form-urlencoded";
const CONTENT_TYPE_HEADING: string = "content-type";

const USERS_CONTROLLER_URL: string = "/users";
const LOGIN_URL: string = `${USERS_CONTROLLER_URL}/login`;
const REGISTER_URL: string = `${USERS_CONTROLLER_URL}/register`;

describe(`${USERS_CONTROLLER_URL} tests`, () => {
   describe(`POST ${LOGIN_URL} tests`, () => {
       it("Should login successfully. Username and password are correct.", () => {
           const usernameToSend: string = "hristofor";
           const passwordToSend: string = "hristofor";
           const expectedPropertyData: string = "data";
           const expectedPropertyMessage: string = "message";
           const expectedAuthHeader: string = "auth-token";

           const expectedStatusCode: number = 200;

           const objectToSend = {
               username: usernameToSend,
               password: passwordToSend
           };

           return request(server)
               .post(LOGIN_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedStatusCode);
                   await expect(result.body).to.have.property(expectedPropertyData);
                   await expect(result.body.data).to.have.property(expectedPropertyMessage);
                   await expect(result).to.have.header(expectedAuthHeader);
                   await expect(result).header(expectedAuthHeader).not.to.be.null;
               });
       });

       it("Should not login and return error. Username exists but the password is wrong.", () => {
           const usernameToSend: string = "hristofor";
           const passwordToSend: string = "kolumb";
           const expectedPropertyData: string = "data";
           const expectedPropertyMessage: string = "message";
           const expectedAuthHeader: string = "auth-token";

           const expectedStatusCode: number = 400;

           const objectToSend = {
               username: usernameToSend,
               password: passwordToSend
           };

           return request(server)
               .post(LOGIN_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedStatusCode);
                   await expect(result.body).to.have.property(expectedPropertyData);
                   await expect(result.body.data).to.have.property(expectedPropertyMessage);
                   await expect(result).not.to.have.header(expectedAuthHeader);
               });
       });

       it("Should not login and return error. This user does not exist.",  () => {
           const usernameToSend: string = "nonExistingUsername";
           const passwordToSend: string = "someRandPassword";
           const expectedPropertyData: string = "data";
           const expectedPropertyMessage: string = "message";
           const expectedAuthHeader: string = "auth-token";

           const expectedStatus: number = 400;

           const objectToSend = {
               username: usernameToSend,
               password: passwordToSend
           };

           return request(server)
               .post(LOGIN_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedStatus);
                   await expect(result.body).to.have.property(expectedPropertyData);
                   await expect(result.body.data).to.have.property(expectedPropertyMessage);
                   await expect(result).not.to.have.header(expectedAuthHeader);
               });
       });
   });

   describe(`POST ${REGISTER_URL} tests`, () => {
       it("Should register a new user. After then test passed, the new user should be deleted.",() => {
           const usernameToSend: string = "trifon";
           const emailToSend: string = "trifon@tri.fon";
           const passwordToSend: string = "trifon";
           const firstNameToSend: string = "Trifon";
           const lastNameToSend: string = "Trifonov";
           const roleIdToSend: number = 1;

           const objectToSend = {
               username: usernameToSend,
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           };

           const expectedHttpStatus: number = 201;

           let userId: number = 0;

           return request(server)
               .post(REGISTER_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedHttpStatus);

                   userId = result.body.data.userId;
               })
               .then(async () => {
                   await usersModel.removeById(userId);
               });
       });

       it("Should not register a new user. The given username already exists in the database.", () => {
           const usernameToSend: string = "ivanivan";
           const emailToSend: string = "trifonivanov@tri.fon";
           const passwordToSend: string = "Ivan123";
           const firstNameToSend: string = "Trifon";
           const lastNameToSend: string = "Trifonov";
           const roleIdToSend: number = 2;

           const objectToSend = {
               username: usernameToSend,
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           };

           const expectedHttpStatus: number = 400;

           const expectedPropertyData: string = "data";
           const expectedPropertySuccess: string = "success";
           const expectedPropertyMessage: string = "message";
           const expectedPropertyErrors: string = "errors";

           const expectedSuccess: boolean = false;
           const expectedErrorsCount: number = 1;

           request(server)
               .post(REGISTER_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                    await expect(result.status).to.eql(expectedHttpStatus);

                    await expect(result.body).to.have.property(expectedPropertyData);
                    await expect(result.body.data).to.have.property(expectedPropertySuccess);
                    await expect(result.body.data).to.have.property(expectedPropertyMessage);
                    await expect(result.body.data).to.have.property(expectedPropertyErrors);

                    await expect(result.body.success).to.eql(expectedSuccess);
                    await expect(result.body.message).to.be("string");
                    await expect(result.body.errors).to.be("array");
                    // await expect(result.body.errors.length).to.have.lengthOf(expectedErrorsCount);
                    // await chai.assert.equal(result.body.errors.length, expectedErrorsCount);
               });
       });

       it("Should not register a new user. Missing 'username' parameter.",  () => {
           const emailToSend: string = "dimitarkirov@abv.bg";
           const passwordToSend: string = "John123nhoj";
           const firstNameToSend: string = "John";
           const lastNameToSend: string = "Kirov";
           const roleIdToSend: number = 1;

           const objectToSend = {
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           };

           const expectedStatus: number = 400;

           const expectedPropertyData: string = "data";
           const expectedPropertySuccess: string = "success";
           const expectedPropertyMessage: string = "message";
           const expectedPropertyErrors: string = "errors";

           const expectedSuccess: boolean = false;
           const expectedErrorsCount: number = 1;

           request(server)
               .post(REGISTER_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedStatus);

                   await expect(result.body).to.have.property(expectedPropertyData);
                   await expect(result.body.data).to.have.property(expectedPropertySuccess);
                   await expect(result.body.data).to.have.property(expectedPropertyMessage);
                   await expect(result.body.data).to.have.property(expectedPropertyErrors);

                   await expect(result.body.data.success).to.eql(expectedSuccess);
                   await chai.assert.equal(result.body.errors, expectedErrorsCount);
                   // await expect(result.body.data.errors).to.have.lengthOf(expectedErrorsCount);
               });
       });

       it("Should not register a new user. The given email already exists in the database.", () => {
           const usernameToSend: string = "johnwaste";
           const emailToSend: string = "hristofor@abv.bg";
           const passwordToSend: string = "John123";
           const firstNameToSend: string = "John";
           const lastNameToSend: string = "Trifonov";
           const roleIdToSend: number = 1;

           const objectToSend = {
               username: usernameToSend,
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           }
       });
   });
});
