import express from "express";
import { MysqlDatabase } from "../database/MysqlDatabase";
import { IRoutable } from "./IRoutable";
import { APIMiddleware } from "../common/APIMiddleware";
import { ReportEntitiesModel } from "../models/ReportEntitiesModel";
import { ReportEntitiesController } from "../controllers/reportEntities/ReportEntitiesController";
import { ResponseBuilder } from "../data/ResponseBuilder";

export class ReportEntitiesRouter implements IRoutable {

    private readonly router: express.Router;
    private readonly controller: ReportEntitiesController;

    constructor(controller: ReportEntitiesController) {
        this.router = express.Router();
        this.controller = controller;
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
                .then((result: ResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                })
                .catch(next);
        });
    }
}
