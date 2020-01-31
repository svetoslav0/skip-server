import server from "../server";
import request from "supertest";

import DoneCallback = jest.DoneCallback;

const LOGIN_URL: string = "/users/login";
const REGISTER_URL: string = "/users/register";

describe(`${LOGIN_URL} tests`, () => {
    describe(`POST ${LOGIN_URL}`, () => {
        it("Test existing user with correct username and password. Should login.", async (done: DoneCallback) => {
            const usernameToSend: string = "username=dimitar";
            const passwordToSend: string = "password=dimitar";
            const expectedStatus: number = 200;

            await request(server)
                .post(LOGIN_URL)
                .send(usernameToSend)
                .send(passwordToSend)
                .expect(expectedStatus);

            done();
        });

        it("Test existing user with correct username, but with wrong password. Should not login.", async (done: DoneCallback) => {
            const usernameToSend: string = "username=dimitar";
            const passwordToSend: string = "password=thisIsWrongPassword";
            const expectedStatus: number = 400;

            await request(server)
                .post(LOGIN_URL)
                .send(usernameToSend)
                .send(passwordToSend)
                .expect(expectedStatus);

            done();
        });

        it("Test non-existing user. Should not login.", async (done: DoneCallback) => {
            const usernameToSend: string = "username=nonExistingUser";
            const passwordToSend: string = "password=evenThePasswordIsWrong";
            const expectedStatus: number = 400;

            await request(server)
                .post(LOGIN_URL)
                .send(usernameToSend)
                .send(passwordToSend)
                .expect(expectedStatus);

            done();
        });

        it("Test /login with username, but without password (the 'password' field is missing). Should not login.", async (done: DoneCallback) => {
            const usernameToSend: string = "dimitar";
            const expectedStatus: number = 400;

            await request(server)
                .post(LOGIN_URL)
                .send(usernameToSend)
                .expect(expectedStatus);

            done();
        });

        it("Test /login with password, but without username (the 'username' field is missing). Should not login.", async (done: DoneCallback) => {
            const passwordToSend: string = "doesNotMatter";
            const expectedStatus: number = 400;

            await request(server)
                .post(LOGIN_URL)
                .send(passwordToSend)
                .expect(expectedStatus);

            done();
        });

        it("Test /login without username and password (both fields are missing). Should not login.", async (done: DoneCallback) => {
            const expectedStatus: number = 400;

            await request(server)
                .post(LOGIN_URL)
                .expect(expectedStatus);

            done();
        });
    });

    describe(`POST ${REGISTER_URL}`, () => {
        it("Test /register with correct data. Should register.", async (done: DoneCallback) => {
            const usernameToSend: string = "username=oneMoreDimitar";
            const emailToSend: string = "email=onemoredimitar@abv.bg";
            const passwordToSend: string = "password=dimitar2";
            const firstNameToSend: string = "firstName=Dimitar";
            const lastNameToSend: string = "lastName=Dimitrov";
            const expectedStatus: number = 201;

            await request(server)
                .post(REGISTER_URL)
                .send(usernameToSend)
                .send(emailToSend)
                .send(passwordToSend)
                .send(firstNameToSend)
                .send(lastNameToSend)
                .expect(expectedStatus);

            done();
        });

        it("Test /register with existing username. Should not register.", async (done: DoneCallback) => {
            const usernameToSend: string = "username=dimitar";
            const emailToSend: string = "nonexistingemail@gmail.com";
            const passwordToSend: string = "thisIsARandomString";
            const firstNameToSend: string = "SomeRandomGuy";
            const lastNameToSend: string = "WithSomeRandomSurname";
            const expectedStatus: number = 400;

            await request(server)
                .post(REGISTER_URL)
                .send(usernameToSend)
                .send(emailToSend)
                .send(passwordToSend)
                .send(firstNameToSend)
                .send(lastNameToSend)
                .expect(expectedStatus);

            done();

            const username: string = "username=dimitri4ka";
            const email: string = "dimitri4ka@gmail.com";
            const password: string = "thisIsARandomString2";
            const firstName: string = "SomeRandomGuy2";
            const lastName: string = "WithSomeRandomSurname2";

            await request(server)
                .post(REGISTER_URL)
                .send(username)
                .send(email)
                .send(password)
                .send(firstName)
                .send(lastName)
        });
    })
});