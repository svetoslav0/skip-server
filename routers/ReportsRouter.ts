import express from "express";
import { MysqlDatabase } from "../database/MysqlDatabase";
import { APIMiddleware } from "../common/APIMiddleware";
import { ReportsModel } from "../models/ReportsModel";
import { ReportsController } from "../controllers/reports/ReportsController";
import { AbstractResponseBuilder } from "../data/AbstractResponseBuilder";
import { IRoutable } from "./IRoutable";

export class ReportsRouter implements IRoutable {

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

    /**
     * This method registers all Reports endpoints
     *
     * @returns {express.Router}
     */
    public registerRoutes(): express.Router {
        this.signCreateRoute();
        this.signEditRoute();
        this.signArchiveRoute();

        return this.router;
    }

    /**
     * This method registers POST /reports
     */
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

    /**
     * This method registers PUT /reports/{id}
     */
    private signEditRoute() {
        this.router.put("/:id",
            APIMiddleware.isUserEmployee,
            (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.controller
                .edit(req)
                .then((result: AbstractResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                })
                .catch(next);
        });
    }

    /**
     * This method registers DELETE /reports/{id}
     */
    private signArchiveRoute() {
        this.router.delete("/:id",
            APIMiddleware.isUserEmployee,
            (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.controller
                .archive(req)
                .then((result: AbstractResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                })
                .catch(next);
        });
    }
}
