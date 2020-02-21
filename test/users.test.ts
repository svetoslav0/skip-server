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

const LOGIN_URL: string = "/users";

describe(`${LOGIN_URL} tests`, () => {
   describe(`POST ${LOGIN_URL}`, () => {
       it('should login', () => {
           return chai.request(server)
               .post(`${LOGIN_URL}/login`)
               .set('content-type', 'application/x-www-form-urlencoded')
               .send({username: "ivanivan", password: "ivanivan"})
               .then(async (result) => {
                   await expect(result.status).to.eql(200);
               });
       });

       it('should NOT login', () => {
           return chai.request(server)
               .post(`${LOGIN_URL}/login`)
               .set('content-type', 'application/x-www-form-urlencoded')
               .send({username: "ivanivan", password: "ivaniasdvan"})
               .then(async (result) => {
                   await expect(result.status).to.eql(400);
               });
       });
   });
});
