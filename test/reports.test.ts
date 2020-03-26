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

import { ReportsModel } from "../models/ReportsModel";

const reportsModel: ReportsModel = new ReportsModel(database);

const REPORTS_CONTROLLERS_URL: string = "/reports";
const CREATE_URL: string = `${REPORTS_CONTROLLERS_URL}`;
const EDIT_URL = (id: number) => {
    return `${REPORTS_CONTROLLERS_URL}/${id}`;
};
const ARCHIVE_URL = (id: number) => {
    return `${REPORTS_CONTROLLERS_URL}/${id}`;
};

describe(`${REPORTS_CONTROLLERS_URL} tests`, () => {
    describe(`POST ${CREATE_URL} tests`, () => {

        noTokenTest(CREATE_URL);
        wrongTokenTest(CREATE_URL);

        it("Should add a new report. After the test passes, the new report should be deleted.", () => {
             const nameToSend: string = "September 2019";
             const userIdToSend: number = 4;

             const objectToSend = {
                 name: nameToSend,
                 userId: userIdToSend
             };

             const expectedHttpStatus: number = 201;
             const expectedIsReportDeleted: boolean = true;

             return Request(server)
                 .post(CREATE_URL)
                 .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                 .set(TOKEN_HEADING, token)
                 .send(objectToSend)
                 .then(async (result: any) => {
                     await expect(result.status).to.eql(expectedHttpStatus);

                     return result.body.data.reportId;
                 })
                 .then(async (reportId: number) => {
                     const result = await reportsModel.deleteById(reportId);
                     await expect(result).to.eql(expectedIsReportDeleted);
                 });
        });

        it("Should not add a new report. Field 'name' is not provided.", () => {
            const userIdToSend: number = 4;

            const objectToSend = {
                userId: userIdToSend
            };

            const expectedHttpStatus: number = 400;
            const expectedSuccessProperty: string = "success";
            const expectedMessageProperty: string = "message";
            const expectedErrorsProperty: string = "errors";

            const expectedSuccess: boolean = false;
            const expectedErrorsCount: number = 1;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(expectedHttpStatus);
                    await expect(result.body.data).to.have.property(expectedSuccessProperty);
                    await expect(result.body.data).to.have.property(expectedMessageProperty);
                    await expect(result.body.data).to.have.property(expectedErrorsProperty);

                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.message).to.be.a("string");
                    await expect(result.body.data.errors).to.be.an("array");
                    await expect(result.body.data.errors.length).to.eql(expectedErrorsCount);
                });
        });

        it("Should not add a new report. Field 'userId' is not provided.", () => {
            const nameToSend: string = "September 2019";

            const objectToSend = {
                name: nameToSend
            };

            const expectedHttpStatus: number = 400;
            const expectedSuccessProperty: string = "success";
            const expectedMessageProperty: string = "message";
            const expectedErrorsProperty: string = "errors";

            const expectedSuccess: boolean = false;
            const minimumExpectedErrorsCount: number = 1;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(expectedHttpStatus);
                    await expect(result.body.data).to.have.property(expectedSuccessProperty);
                    await expect(result.body.data).to.have.property(expectedMessageProperty);
                    await expect(result.body.data).to.have.property(expectedErrorsProperty);

                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.message).to.be.a("string");
                    await expect(result.body.data.errors).to.be.an("array");
                    await expect(result.body.data.errors.length).to.be.at.least(minimumExpectedErrorsCount);
                });
        });

        it("Should not add a new report. No fields are provided", () => {
            const expectedHttpStatus: number = 400;
            const expectedSuccessProperty: string = "success";
            const expectedMessageProperty: string = "message";
            const expectedErrorsProperty: string = "errors";

            const expectedSuccess: boolean = false;
            const minimumExpectedErrorsCount: number = 2;

            return Request(server)
                .post(CREATE_URL)
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(expectedHttpStatus);
                    await expect(result.body.data).to.have.property(expectedErrorsProperty);
                    await expect(result.body.data).to.have.property(expectedMessageProperty);
                    await expect(result.body.data).to.have.property(expectedSuccessProperty);

                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.message).to.be.a("string");
                    await expect(result.body.data.errors).to.be.an("array");
                    await expect(result.body.data.errors.length).to.be.at.least(minimumExpectedErrorsCount);
                });
        });
    });

    describe(`PUT ${REPORTS_CONTROLLERS_URL}/{id} tests`, () => {

        noTokenTest(REPORTS_CONTROLLERS_URL);
        wrongTokenTest(REPORTS_CONTROLLERS_URL);

        it("Should update an report.",  () => {
            const nameToSend: string = "October 2020";
            const userIdToSend: number = 4;
            const reportIdToUpdate: number = 15;

            const objectToSend = {
                name: nameToSend,
                userId: userIdToSend
            };

            const expectedStatus: number = 200;
            const expectedSuccess: boolean = true;

            return Request(server)
                .put(EDIT_URL(reportIdToUpdate))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(expectedStatus);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.reportId).to.eql(reportIdToUpdate);
                });
        });

        it(`Should not update the report.
            The given "id" does not correspond to an existing report`,  () => {
            const nameToSend: string = "October 2020";
            const userIdToSend: number = 4;
            const reportIdToUpdate: number = 91501;

            const objectToSend = {
                name: nameToSend,
                userId: userIdToSend
            };

            const expectedStatus: number = 400;
            const expectedSuccess: boolean = false;
            const expectedErrorsProperty: string = "errors";

            return Request(server)
                .put(EDIT_URL(reportIdToUpdate))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send(objectToSend)
                .then(async (result: any) => {
                    await expect(result.status).to.eql(expectedStatus);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data).to.have.property(expectedErrorsProperty);
                });
        });

    });

    describe(`DELETE ${REPORTS_CONTROLLERS_URL}/id tests`, () => {

        noTokenTest(REPORTS_CONTROLLERS_URL);
        wrongTokenTest(REPORTS_CONTROLLERS_URL);

        it(`Should archive the report`, () => {
            const reportIdToSend: number = 14;

            const expectedStatus: number = 200;
            const dataProperty: string = "data";
            const successProperty: string = "success";
            const expectedSuccess: boolean = true;

            return Request(server)
                .delete(ARCHIVE_URL(reportIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(expectedStatus);
                    await expect(result.body).to.have.property(dataProperty);
                    await expect(result.body.data).to.have.property(successProperty);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                });
        });

        it(`Should not archive the report.
        The given ID does not correspond to an existing report.`, () => {
            const reportIdToSend: number = 99999;

            const expectedStatus: number = 400;
            const dataProperty: string = "data";
            const successProperty: string = "success";
            const expectedSuccess: boolean = false;

            return Request(server)
                .delete(ARCHIVE_URL(reportIdToSend))
                .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
                .set(TOKEN_HEADING, token)
                .send()
                .then(async (result: any) => {
                    await expect(result.status).to.eql(expectedStatus);
                    await expect(result.body).to.have.property(dataProperty);
                    await expect(result.body.data).to.have.property(successProperty);
                    await expect(result.body.data.success).to.eql(expectedSuccess);
                });
        });
    });
});
