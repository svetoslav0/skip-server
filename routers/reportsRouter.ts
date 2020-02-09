import express from "express";
import { MysqlDatabase } from "../database/MysqlDatabase";
import { APIMiddleware } from "../common/APIMiddleware";
import { ReportsModel } from "../models/ReportsModel";
import { ReportsController } from "../controllers/reports/ReportsController";
import { ReportResponseBuilder } from "../controllers/reports/ReportResponseBuilder";

const reportsRouter = express.Router();

const db: MysqlDatabase = new MysqlDatabase();
const reportsModel: ReportsModel = new ReportsModel(db);
const reportsController: ReportsController = new ReportsController(reportsModel);
const reportResponseBuilder: ReportResponseBuilder = new ReportResponseBuilder();

reportsRouter.post("/create", APIMiddleware.isUserEmployee, (req: express.Request, res: express.Response) => {
    reportsController
        .create(req)
        .then((result) => {
            return res
                .status(result.httpStatus)
                .send(
                    reportResponseBuilder.buildCreateResponse(result)
                );
        });
});

reportsRouter.put("/:id", APIMiddleware.isUserEmployee, (req: express.Request, res: express.Response) => {
    reportsController
        .edit(req)
        .then(result => {
            return res
                .status(result.httpStatus)
                .send(
                    reportResponseBuilder.buildCreateResponse(result)
                );
        });
});

export { reportsRouter };
