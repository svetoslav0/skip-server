import express from "express";
import { MysqlDatabase } from "../database/MysqlDatabase";
import { ClassRolesController } from "../controllers/classRoles/ClassRolesController";
import { ClassRolesModel } from "../models/ClassRolesModel";
import {APIMiddleware} from "../common/APIMiddleware";
import {AbstractResponseBuilder} from "../data/AbstractResponseBuilder";

export class ClassRolesRouter {
    private readonly db: MysqlDatabase;
    private readonly router: express.Router;
    private readonly model: ClassRolesModel;
    private controller: ClassRolesController;

    constructor(database: MysqlDatabase) {
        this.db = database;
        this.router = express.Router();
        this.model = new ClassRolesModel(this.db);
        this.controller = new ClassRolesController(this.model);
    }

    /**
     * This method registers all Class Roles endpoints
     *
     * @returns {express.Router}
     */
    public registerRoutes(): express.Router {
        this.signCreateRoute();
        this.signEditRoute();

        return this.router;
    }

    /**
     * This method registers POST /classRoles
     */
    private signCreateRoute() {
        this.router.post("/",
            APIMiddleware.isUserAdministrator,
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
     * Ths method registers PUT /classRoles
     */
    private signEditRoute() {
        this.router.put("/:id",
            APIMiddleware.isUserAdministrator,
            (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.controller
                .edit(req)
                .then((result: AbstractResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse())
                })
                .catch(next);
        });
    }
}
