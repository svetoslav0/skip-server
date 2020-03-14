import express from "express";
import { MysqlDatabase } from "../database/MysqlDatabase";
import { APIMiddleware } from "../common/APIMiddleware";
import { ReportsModel } from "../models/ReportsModel";
import { ReportsController } from "../controllers/reports/ReportsController";
import { ReportResponseBuilder } from "../controllers/reports/ReportResponseBuilder";

export class ReportsRouter {

    private readonly db: MysqlDatabase;
    private readonly router: express.Router;
    private readonly model: ReportsModel;
    private controller: ReportsController;
    private responseBuilder: ReportResponseBuilder;

    constructor(database: MysqlDatabase) {
        this.db = database;
        this.router = express.Router();
        this.model = new ReportsModel(this.db);
        this.controller = new ReportsController(this.model);
        this.responseBuilder = new ReportResponseBuilder();
    }

    public registerRoutes(): express.Router {
        this.signCreateRoute();
        this.signEditRoute();

        return this.router;
    }

    private signCreateRoute() {
        this.router.post("/create", APIMiddleware.isUserEmployee, (req: express.Request, res: express.Response) => {
            this.controller
                .create(req)
                .then((result) => {
                    return res
                        .status(result.httpStatus)
                        .send(
                            this.responseBuilder.buildCreateResponse(result)
                        );
                });
        });
    }

    private signEditRoute() {
        this.router.put("/:id", APIMiddleware.isUserEmployee, (req: express.Request, res: express.Response) => {
            this.controller
                .edit(req)
                .then((result) => {
                    return res
                        .status(result.httpStatus)
                        .send(
                            this.responseBuilder.buildCreateResponse(result)
                        );
                });
        });
    }
}
