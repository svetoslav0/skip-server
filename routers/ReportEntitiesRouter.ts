import express from "express";
import { IRoutable } from "./IRoutable";
import { APIMiddleware } from "../common/APIMiddleware";
import { ReportEntitiesController } from "../controllers/reportEntities/ReportEntitiesController";
import { ManipulationsResponseBuilder } from "../data/ManipulationsResponseBuilder";

export class ReportEntitiesRouter implements IRoutable {

    private readonly router: express.Router;
    private readonly controller: ReportEntitiesController;

    constructor(controller: ReportEntitiesController) {
        this.router = express.Router();
        this.controller = controller;
    }

    public registerRoutes(): express.Router {
        this.signCreateRoute();
        this.signEditRoute();
        this.signArchiveRoute();

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
}
