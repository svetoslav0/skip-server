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

export {
    server,
    database,
    expect,
    Request
};
