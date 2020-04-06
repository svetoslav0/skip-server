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

const adminToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzNiwicm9sZUlkIjoyLCJpYXQiOjE1ODU5MTQzNDB9.U9G-udZGXB45bymReME00JhGtZlPpxaNOT4FGLN9-jo";
const employeeToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzNywicm9sZUlkIjoxLCJpYXQiOjE1ODU5MTQzNzB9.g1y3a-ATpXbkumNSNd6JayOzLNeRPzAMtv-9zsA31ig";
const employeeReportId: number = 13;

module.exports = {
    server,
    database,
    expect,
    Request,
    DEFAULT_CONTENT_TYPE,
    CONTENT_TYPE_HEADING,
    TOKEN_HEADING,
    adminToken,
    employeeToken,
    employeeReportId
};
