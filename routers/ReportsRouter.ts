import express from "express";
import { APIMiddleware } from "../common/APIMiddleware";
import { ReportsController } from "../controllers/reports/ReportsController";
import { IRoutable } from "./IRoutable";
import { ResponseBuilder } from "../data/ResponseBuilder";

export class ReportsRouter implements IRoutable {

    private readonly router: express.Router;
    private readonly controller: ReportsController;

    constructor(controller: ReportsController) {
        this.router = express.Router();
        this.controller = controller;
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
                .then((result: ResponseBuilder) => {
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
                .then((result: ResponseBuilder) => {
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
                .then((result: ResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                })
                .catch(next);
        });
    }
}
