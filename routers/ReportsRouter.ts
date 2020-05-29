import express from "express";
import { APIMiddleware } from "../common/APIMiddleware";
import { ReportsController } from "../controllers/reports/ReportsController";
import { IRoutable } from "./IRoutable";
import { ManipulationsResponseBuilder } from "../data/ManipulationsResponseBuilder";
import { DataResponseBuilder } from "../data/DataResponseBuilder";

export class ReportsRouter implements IRoutable {

    private readonly router: express.Router;
    private readonly controller: ReportsController;

    constructor(controller: ReportsController) {
        this.router = express.Router();
        this.controller = controller;
    }

    /**
     * @returns {express.Router}
     */
    public registerRoutes(): express.Router {
        this.signCreateRoute();
        this.signEditRoute();
        this.signArchiveRoute();
        this.signGetReport();

        return this.router;
    }

    private signCreateRoute() {
        this.router.post("/",
            APIMiddleware.isUserEmployee,
            (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.controller
                .create(req)
                .then((result: ManipulationsResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                })
                .catch(next);
        });
    }

    private signEditRoute() {
        this.router.put("/:id",
            APIMiddleware.isUserEmployee,
            (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.controller
                .edit(req)
                .then((result: ManipulationsResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                })
                .catch(next);
        });
    }

    private signArchiveRoute() {
        this.router.delete("/:id",
            APIMiddleware.isUserEmployee,
            (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.controller
                .archive(req)
                .then((result: ManipulationsResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                })
                .catch(next);
        });
    }

    private signGetReport() {
        this.router.get("/:id",
            APIMiddleware.isUserEmployee,
            (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.controller
                .getReportById(req)
                .then((result: DataResponseBuilder) => {
                    return res
                        .status(result.getStatus())
                        .send(result.buildResponse());
                })
                .catch(next);
        });
    }
}
