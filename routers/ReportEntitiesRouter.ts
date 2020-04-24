import express from "express";
import { MysqlDatabase } from "../database/MysqlDatabase";
import { IRoutable } from "./IRoutable";
import { APIMiddleware } from "../common/APIMiddleware";
import { AbstractResponseBuilder } from "../data/AbstractResponseBuilder";
import { ReportEntitiesModel } from "../models/ReportEntitiesModel";
import { ReportEntitiesController } from "../controllers/reportEntities/ReportEntitiesController";

export class ReportEntitiesRouter implements IRoutable {

    private readonly db: MysqlDatabase;
    private readonly router: express.Router;
    private readonly controller: ReportEntitiesController;

    constructor(database: MysqlDatabase) {
        this.db = database;
        this.router = express.Router();
        this.controller = new ReportEntitiesController(
            new ReportEntitiesModel(database)
        );
    }

    public registerRoutes(): express.Router {
        this.signCreateRoute();

        return this.router;
    }

    private signCreateRoute() {
        this.router.post("/",
            APIMiddleware.isUserEmployee,
            (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.controller
                .create(req)
                .then((result: AbstractResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                })
                .catch(next);
        });
    }
}
