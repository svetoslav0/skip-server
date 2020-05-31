import httpStatus from "http-status-codes";

import {database, expect, Request, server} from "./base";

import {UsersRepository} from "../repositories/UsersRepository";
import {noTokenTest, wrongTokenTest} from "./commonTests";
import {HttpMethod} from "./httpMethods";

const usersRepository: UsersRepository = new UsersRepository(database);

const CONTENT_TYPE_HEADING: string = process.env.CONTENT_TYPE_HEADING || "";
const DEFAULT_CONTENT_TYPE = process.env.DEFAULT_CONTENT_TYPE || "";
const TOKEN_HEADING = process.env.TOKEN_HEADING || "";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const EMPLOYEE_TOKEN = process.env.EMPLOYEE_TOKEN || "";
const ADMIN_USER_ID_ONE: number = +process.env.ADMIN_USER_ID_ONE! || 0;
const ADMIN_USER_ID_TWO: number = +process.env.ADMIN_USER_ID_TWO! || 0;
const EMPLOYEE_USER_ID: number = +process.env.EMPLOYEE_USER_ID! || 0;

const USERS_CONTROLLER_URL: string = "/users";
const LOGIN_URL: string = `${USERS_CONTROLLER_URL}/login`;
const REGISTER_URL: string = `${USERS_CONTROLLER_URL}/register`;
const ULR_WITH_PARAM = (id: number | string | null) => {
    return `${USERS_CONTROLLER_URL}/${id}`;
};

describe(`${USERS_CONTROLLER_URL} tests`, () => {
    describe(`POST ${LOGIN_URL} tests`, () => {
        it("Should login successfully. Username and password are correct", () => {
            const usernameToSend: string = "hristofor";
            const passwordToSend: string = "hristofor";
            const expectedPropertyData: string = "data";
            const expectedPropertyMessage: string = "message";
            const expectedAuthHeader: string = "auth-token";

            const objectToSend = {
                username: usernameToSend,
                password: passwordToSend
            };

            return Request(server)
                .post(LOGIN_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.OK);
                    await expect(response.body).to.have.property(expectedPropertyData);
                    await expect(response.body.data).to.have.property(expectedPropertyMessage);
                    await expect(response).to.have.header(expectedAuthHeader);
                    await expect(response).header(expectedAuthHeader).not.to.be.null;
                });
        });

        it("Should not login and return error. Username exists but the password is wrong", () => {
            const usernameToSend: string = "hristofor";
            const passwordToSend: string = "kolumb";
            const expectedPropertyData: string = "data";
            const expectedPropertyMessage: string = "message";
            const expectedAuthHeader: string = "auth-token";

            const objectToSend = {
                username: usernameToSend,
                password: passwordToSend
            };

            return Request(server)
                .post(LOGIN_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(response.body).to.have.property(expectedPropertyData);
                    await expect(response.body.data).to.have.property(expectedPropertyMessage);
                    await expect(response).not.to.have.header(expectedAuthHeader);
                });
        });

        it("Should not login and return error. This user does not exist",  () => {
            const usernameToSend: string = "nonExistingUsername";
            const passwordToSend: string = "someRandPassword";
            const expectedPropertyData: string = "data";
            const expectedPropertyMessage: string = "message";
            const expectedAuthHeader: string = "auth-token";

            const objectToSend = {
                username: usernameToSend,
                password: passwordToSend
            };

            return Request(server)
                .post(LOGIN_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(response.body).to.have.property(expectedPropertyData);
                    await expect(response.body.data).to.have.property(expectedPropertyMessage);
                    await expect(response).not.to.have.header(expectedAuthHeader);
                });
        });
    });

    describe(`POST ${REGISTER_URL} tests`, () => {
        it("Should register a new user. After the test passes, the new user should be deleted", () => {
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

            return Request(server)
                .post(REGISTER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.CREATED);

                    return  response.body.data.userId;
                })
                .then(async (userId: any) => {
                    await usersRepository.removeById(userId);
                });
        });

        it("Should not register a new user. The given username already exists in the database", () => {
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

            const expectedPropertyData: string = "data";
            const expectedPropertySuccess: string = "success";
            const expectedPropertyMessage: string = "message";
            const expectedPropertyErrors: string = "errors";

            const expectedSuccess: boolean = false;
            const expectedErrorsCount: number = 1;

            return Request(server)
                .post(REGISTER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);

                    await expect(response.body).to.have.property(expectedPropertyData);
                    await expect(response.body.data).to.have.property(expectedPropertySuccess);
                    await expect(response.body.data).to.have.property(expectedPropertyMessage);
                    await expect(response.body.data).to.have.property(expectedPropertyErrors);

                    await expect(response.body.data.success).to.eql(expectedSuccess);
                    await expect(response.body.data.message).to.be.a("string");
                    await expect(response.body.data.errors).to.be.an("array");
                    await expect(response.body.data.errors.length).to.eql(expectedErrorsCount);
                });
        });

        it("Should not register a new user. Missing 'username' parameter",  () => {
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

            const expectedPropertyData: string = "data";
            const expectedPropertySuccess: string = "success";
            const expectedPropertyMessage: string = "message";
            const expectedPropertyErrors: string = "errors";

            const expectedSuccess: boolean = false;
            const expectedErrorsCount: number = 1;

            return Request(server)
                .post(REGISTER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);

                    await expect(response.body).to.have.property(expectedPropertyData);
                    await expect(response.body.data).to.have.property(expectedPropertySuccess);
                    await expect(response.body.data).to.have.property(expectedPropertyMessage);
                    await expect(response.body.data).to.have.property(expectedPropertyErrors);

                    await expect(response.body.data.success).to.eql(expectedSuccess);
                    await expect(response.body.data.errors.length).to.eql(expectedErrorsCount);
                });
        });

        it("Should not register a new user. The given username is too short", () => {
            const usernameToSend: string = "sh";
            const emailToSend: string = "doesitmatteranyway@abv.bg";
            const passwordToSend: string = "John123as";
            const firstNameToSend: string = "John";
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

            const expectedSuccess: boolean = false;
            const expectedErrorsCount: number = 1;

            return Request(server)
                .post(REGISTER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(response.body.data.success).to.eql(expectedSuccess);
                    await expect(response.body.data.errors.length).to.eql(expectedErrorsCount);
                });
        });

        it("Should not register a new user. The given username is too long", () => {
            const usernameToSend: string = "ashrosenbergashrosenbergashrosenbergashrosenbergashrosenbergashrosenberg";
            const emailToSend: string = "doesthatmatteranyway@abv.bg";
            const passwordToSend: string = "john123john";
            const firstNameToSend: string = "Johny";
            const lastNameToSend: string = "Johsef";
            const roleIdToSend: number = 1;

            const objectToSend = {
                username: usernameToSend,
                email: emailToSend,
                password: passwordToSend,
                firstName: firstNameToSend,
                lastName: lastNameToSend,
                roleId: roleIdToSend
            };

            const expectedSuccess: boolean = false;
            const expectedErrorsCount: number = 1;

            return Request(server)
                .post(REGISTER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(response.body.data.success).to.eql(expectedSuccess);
                    await expect(response.body.data.errors.length).to.eql(expectedErrorsCount);
                });
        });

        it("Should not register a new user. The given email is invalid", () => {
            const usernameToSend: string = "ashrosenberg";
            const emailToSend: string = "bademail";
            const passwordToSend: string = "John123";
            const firstNameToSend: string = "Johneff";
            const lastNameToSend: string = "George";
            const roleIdToSend: number = 1;

            const objectToSend = {
                username: usernameToSend,
                email: emailToSend,
                password: passwordToSend,
                firstName: firstNameToSend,
                lastName: lastNameToSend,
                roleId: roleIdToSend
            };

            const expectedSuccess: boolean = false;
            const expectedErrorsCount: number = 1;

            return Request(server)
                .post(REGISTER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(response.body.data.success).to.eql(expectedSuccess);
                    await expect(response.body.data.errors.length).to.eql(expectedErrorsCount);
                });
        });

        it("Should not register a new user. The given email already exists in the database", () => {
            const usernameToSend: string = "johnwastetimer";
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
            };

            const expectedSuccess: boolean = false;
            const expectedErrorsCount: number = 1;

            return Request(server)
                .post(REGISTER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(response.body.data.success).to.eql(expectedSuccess);
                    await expect(response.body.data.errors.length).to.eql(expectedErrorsCount);
                });
        });

        it("Should not register a new user. The given password is too short", () => {
            const usernameToSend: string = "johnywastetimer";
            const emailToSend: string = "hristoforoff@abv.bg";
            const passwordToSend: string = "sh";
            const firstNameToSend: string = "Marvin";
            const lastNameToSend: string = "John";
            const roleIdToSend: number = 2;

            const objectToSend = {
                username: usernameToSend,
                email: emailToSend,
                password: passwordToSend,
                firstName: firstNameToSend,
                lastName: lastNameToSend,
                roleId: roleIdToSend
            };

            const expectedSuccess: boolean = false;
            const expectedErrorsCount: number = 1;

            return Request(server)
                .post(REGISTER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(response.body.data.success).to.eql(expectedSuccess);
                    await expect(response.body.data.errors.length).to.eql(expectedErrorsCount);
                });
        });

        it("Should not register a new user. The given password is too long", () => {
            const usernameToSend: string = "johnywastetimer2";
            const emailToSend: string = "hristoforoff2@abv.bg";
            const passwordToSend: string = "dontaskmehowlongisthispassworditswaaaaaaaaaaaaaaaaaaaaaaaaaytooooooooooooooooooooooooloooooooooooooooooooooooooooongdaaaaaaaaaaaaaaaaaaaaaaaaaaamn";
            const firstNameToSend: string = "Marvinski";
            const lastNameToSend: string = "Johneff";
            const roleIdToSend: number = 2;

            const objectToSend = {
                username: usernameToSend,
                email: emailToSend,
                password: passwordToSend,
                firstName: firstNameToSend,
                lastName: lastNameToSend,
                roleId: roleIdToSend
            };

            const expectedSuccess: boolean = false;
            const expectedErrorsCount: number = 1;

            return Request(server)
                .post(REGISTER_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .send(objectToSend)
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);
                    await expect(response.body.data.success).to.eql(expectedSuccess);
                    await expect(response.body.data.errors.length).to.eql(expectedErrorsCount);
                });
        });
    });

    describe(`GET ${USERS_CONTROLLER_URL} tests`, () => {

        noTokenTest(HttpMethod.Get, ULR_WITH_PARAM(ADMIN_USER_ID_ONE));
        wrongTokenTest(HttpMethod.Get, ULR_WITH_PARAM(ADMIN_USER_ID_ONE));

        it("Should return data for user. Success test No. 1", () => {

            const expectedUsername: string = "ivanivan";
            const expectedEmail: string = "dimi21taar@abv.bg";
            const expectedFirstName: string = "DImitar";
            const expectedLastName: string = "Dimitar";
            const expectedRoleId: number = 2;

            return Request(server)
                .get(ULR_WITH_PARAM(ADMIN_USER_ID_ONE))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.OK);

                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data).to.have.property("username");
                    await expect(response.body.data).to.have.property("email");
                    await expect(response.body.data).to.have.property("firstName");
                    await expect(response.body.data).to.have.property("middleName");
                    await expect(response.body.data).to.have.property("lastName");
                    await expect(response.body.data).to.have.property("roleId");
                    await expect(response.body.data).to.have.property("description");

                    await expect(response.body.data.username).to.be.a("string");
                    await expect(response.body.data.email).to.be.a("string");
                    await expect(response.body.data.firstName).to.be.a("string");
                    await expect(response.body.data.middleName).to.be.a("null");
                    await expect(response.body.data.lastName).to.be.a("string");
                    await expect(response.body.data.roleId).to.be.a("number");
                    await expect(response.body.data.description).to.be.a("null");

                    await expect(response.body.data.username).to.eql(expectedUsername);
                    await expect(response.body.data.email).to.eql(expectedEmail);
                    await expect(response.body.data.firstName).to.eql(expectedFirstName);
                    await expect(response.body.data.firstName).to.eql(expectedFirstName);
                    await expect(response.body.data.lastName).to.eql(expectedLastName);
                    await expect(response.body.data.roleId).to.eql(expectedRoleId);
                });
        });

        it("Should return data for user. Success test No. 2", () => {

            const expectedUsername: string = "adminadmin";
            const expectedEmail: string = "admin@admin.admin";
            const expectedFirstName: string = "Pass: adminadmin";
            const expectedLastName: string = "Admin";
            const expectedRoleId: number = 2;

            return Request(server)
                .get(ULR_WITH_PARAM(ADMIN_USER_ID_TWO))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.OK);

                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data).to.have.property("username");
                    await expect(response.body.data).to.have.property("email");
                    await expect(response.body.data).to.have.property("firstName");
                    await expect(response.body.data).to.have.property("middleName");
                    await expect(response.body.data).to.have.property("lastName");
                    await expect(response.body.data).to.have.property("roleId");
                    await expect(response.body.data).to.have.property("description");

                    await expect(response.body.data.username).to.be.a("string");
                    await expect(response.body.data.email).to.be.a("string");
                    await expect(response.body.data.firstName).to.be.a("string");
                    await expect(response.body.data.middleName).to.be.a("null");
                    await expect(response.body.data.lastName).to.be.a("string");
                    await expect(response.body.data.roleId).to.be.a("number");
                    await expect(response.body.data.description).to.be.a("null");

                    await expect(response.body.data.username).to.eql(expectedUsername);
                    await expect(response.body.data.email).to.eql(expectedEmail);
                    await expect(response.body.data.firstName).to.eql(expectedFirstName);
                    await expect(response.body.data.firstName).to.eql(expectedFirstName);
                    await expect(response.body.data.lastName).to.eql(expectedLastName);
                    await expect(response.body.data.roleId).to.eql(expectedRoleId);
                });
        });

        it("Should return data for user. Success test No. 3", () => {

            const expectedUsername: string = "test-employee";
            const expectedEmail: string = "employee@abv.bg";
            const expectedFirstName: string = "Pass:1-6";
            const expectedLastName: string = "Trifonov";
            const expectedRoleId: number = 1;

            return Request(server)
                .get(ULR_WITH_PARAM(EMPLOYEE_USER_ID))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.OK);

                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data).to.have.property("username");
                    await expect(response.body.data).to.have.property("email");
                    await expect(response.body.data).to.have.property("firstName");
                    await expect(response.body.data).to.have.property("middleName");
                    await expect(response.body.data).to.have.property("lastName");
                    await expect(response.body.data).to.have.property("roleId");
                    await expect(response.body.data).to.have.property("description");

                    await expect(response.body.data.username).to.be.a("string");
                    await expect(response.body.data.email).to.be.a("string");
                    await expect(response.body.data.firstName).to.be.a("string");
                    await expect(response.body.data.middleName).to.be.a("null");
                    await expect(response.body.data.lastName).to.be.a("string");
                    await expect(response.body.data.roleId).to.be.a("number");
                    await expect(response.body.data.description).to.be.a("null");

                    await expect(response.body.data.username).to.eql(expectedUsername);
                    await expect(response.body.data.email).to.eql(expectedEmail);
                    await expect(response.body.data.firstName).to.eql(expectedFirstName);
                    await expect(response.body.data.firstName).to.eql(expectedFirstName);
                    await expect(response.body.data.lastName).to.eql(expectedLastName);
                    await expect(response.body.data.roleId).to.eql(expectedRoleId);
                });
        });

        it("Should fail. Provided ID is not numeric", () => {
            const id: string = "15a";

            return Request(server)
                .get(ULR_WITH_PARAM(id))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);

                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data).to.have.property("error");

                    await expect(response.body.data.error).to.be.a("string");
                });
        });

        it("Should fail. Provided ID does not exist", () => {
            const id: number = 0;

            return Request(server)
                .get(ULR_WITH_PARAM(id))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, ADMIN_TOKEN)
                .send()
                .then(async (response: any) => {
                    await expect(response.status).to.eql(httpStatus.BAD_REQUEST);

                    await expect(response.body).to.have.property("data");
                    await expect(response.body.data).to.have.property("error");

                    await expect(response.body.data.error).to.be.a("string");
                });
        });
    });
});
