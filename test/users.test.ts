process.env.ENVIRONMENT = "test";

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

import server from "../server";
import chai from "chai";
import chaiHttp from "chai-http";
import "mocha";

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

const DEFAULT_CONTENT_TYPE: string = "application/x-www-form-urlencoded";
const CONTENT_TYPE_HEADING: string = "content-type";

const USERS_CONTROLLER_URL: string = "/users";
const LOGIN_URL: string = `${USERS_CONTROLLER_URL}/login`;

describe(`${USERS_CONTROLLER_URL} tests`, () => {
   describe(`POST ${LOGIN_URL} tests`, () => {
       it("Should login successfully. Username and password are correct", () => {
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

       it("Should not login and return error. Username exists but the password is wrong", () => {
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

       it("Should not login and return error. This user does not exist",  () => {
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
});
