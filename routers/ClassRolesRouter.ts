import express from "express";
import { ClassRolesController } from "../controllers/classRoles/ClassRolesController";
import { APIMiddleware } from "../common/APIMiddleware";
import { IRoutable } from "./IRoutable";
import { ResponseBuilder } from "../data/ResponseBuilder";

export class ClassRolesRouter implements IRoutable {
    private readonly router: express.Router;
    private readonly controller: ClassRolesController;

    constructor(controller: ClassRolesController) {
        this.router = express.Router();
        this.controller = controller;
    }

    /**
     * This method registers all Class Roles endpoints
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
     * This method registers POST /classRoles endpoint
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
     * This method registers PUT /classRoles/{id} endpoint
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
     * This method registers DELETE /classRoles/{id} endpoint
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
