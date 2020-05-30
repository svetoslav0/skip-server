import express from "express";
import { APIMiddleware } from "../common/APIMiddleware";
import { ClassesController } from "../controllers/classes/ClassesController";
import { IRoutable } from "./IRoutable";
import { ManipulationsResponseBuilder } from "../data/ManipulationsResponseBuilder";
import {DataResponseBuilder} from "../data/DataResponseBuilder";

export class ClassesRouter implements IRoutable {

    private readonly router: express.Router;
    private readonly controller: ClassesController;

    constructor(controller: ClassesController) {
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
        this.signGetClassesRoute();

        return this.router;
    }

    private signCreateRoute() {
        this.router.post("/",
            APIMiddleware.isUserAdministrator,
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
            APIMiddleware.isUserAdministrator,
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
            APIMiddleware.isUserAdministrator,
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

    private signGetClassesRoute() {
        this.router.get("/",
            APIMiddleware.isUserEmployee,
            (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.controller
                .getAll()
                .then((result: DataResponseBuilder) => {
                    return res
                        .status(result.getStatus())
                        .send(result.buildResponse());
                });
        });
    }
}
