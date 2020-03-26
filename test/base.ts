process.env.ENVIRONMENT = "test";

import { server, database } from "../server";

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

import chai from "chai";
import chaiHttp from "chai-http";
import "mocha";

chai.use(chaiHttp);

const expect = chai.expect;
const Request = chai.request;

const DEFAULT_CONTENT_TYPE: string = "application/x-www-form-urlencoded";
const CONTENT_TYPE_HEADING: string = "content-type";
const TOKEN_HEADING: string = "auth-token";

const token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGVJZCI6MiwiaWF0IjoxNTg0Mjg2MjUzfQ.dUm6sU7RobQucIRH3Vf1C-tr2EgwL0gQ49xQ9CAPIqs";

module.exports = {
    server,
    database,
    expect,
    Request,
    DEFAULT_CONTENT_TYPE,
    CONTENT_TYPE_HEADING,
    TOKEN_HEADING,
    token
};
