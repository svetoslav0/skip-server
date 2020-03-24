import express from "express";
import { MysqlDatabase } from "../database/MysqlDatabase";
import { APIMiddleware } from "../common/APIMiddleware";
import { ReportsModel } from "../models/ReportsModel";
import { ReportsController } from "../controllers/reports/ReportsController";
import { ReportsResponseBuilder } from "../data/reports/ReportsResponseBuilder";

export class ReportsRouter {

    private readonly db: MysqlDatabase;
    private readonly router: express.Router;
    private readonly model: ReportsModel;
    private controller: ReportsController;

    constructor(database: MysqlDatabase) {
        this.db = database;
        this.router = express.Router();
        this.model = new ReportsModel(this.db);
        this.controller = new ReportsController(this.model);
    }

    public registerRoutes(): express.Router {
        this.signCreateRoute();
        this.signEditRoute();
        this.signArchiveRoute();

        return this.router;
    }

    private signCreateRoute() {
        this.router.post("/", APIMiddleware.isUserEmployee, (req: express.Request, res: express.Response) => {
            this.controller
                .create(req)
                .then((result: ReportsResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                });
        });
    }

    private signEditRoute() {
        this.router.put("/:id", APIMiddleware.isUserEmployee, (req: express.Request, res: express.Response) => {
            this.controller
                .edit(req)
                .then((result: ReportsResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                });
        });
    }

    private signArchiveRoute() {
        this.router.delete("/:id", APIMiddleware.isUserEmployee, (req: express.Request, res: express.Response) => {
            this.controller
                .archive(req)
                .then((result: ReportsResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                });
        });
    }
}
