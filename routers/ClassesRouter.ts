import express from "express";
import { APIMiddleware } from "../common/APIMiddleware";
import { ClassesController } from "../controllers/classes/ClassesController";
import { IRoutable } from "./IRoutable";
import { ResponseBuilder } from "../data/ResponseBuilder";

export class ClassesRouter implements IRoutable {

    private readonly router: express.Router;
    private readonly controller: ClassesController;

    constructor(controller: ClassesController) {
        this.router = express.Router();
        this.controller = controller;
    }

    /**
     * This method registers all Classes endpoints
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
     * This method registers POST /classes
     */
    private signCreateRoute() {
        this.router.post("/",
            APIMiddleware.isUserAdministrator,
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
     * This method registers PUT /classes/{id}
     */
    private signEditRoute() {
        this.router.put("/:id",
            APIMiddleware.isUserAdministrator,
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
     * This method registers DELETE /classes/{id}
     */
    private signArchiveRoute() {
        this.router.delete("/:id",
            APIMiddleware.isUserAdministrator,
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
