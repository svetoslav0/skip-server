import express from "express";
import { UsersController } from "../controllers/users/UsersController";
import { UserAccountsResponseBuilder } from "../data/users/UserAccountsResponseBuilder";
import { IRoutable } from "./IRoutable";
import { DataResponseBuilder } from "../data/DataResponseBuilder";
import { APIMiddleware } from "../common/APIMiddleware";

export class UsersRouter implements IRoutable {

    private readonly router: express.Router;
    private readonly controller: UsersController;

    constructor(controller: UsersController) {
        this.router = express.Router();
        this.controller = controller;
    }

    public registerRoutes(): express.Router {
        this.signLoginRoute();
        this.signRegisterRoute();
        this.signGetUsersRoute();

        return this.router;
    }

    private signLoginRoute() {
        this.router.post("/login", (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.controller
                .login(req.body)
                .then((result: UserAccountsResponseBuilder) => {
                    const authToken = result.authToken || "";

                    if (authToken) {
                        res.header("auth-token", authToken);
                    }

                    return res
                        .status(result.httpStatus)
                        .send(result.buildAccountsResponse());
                })
                .catch(next);
        });
    }

    // TODO: This method should not be used by "everyone".
    // Currently is accessible for everyone for development purposes.
    private signRegisterRoute() {
        this.router.post("/register", (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.controller
                .register(req.body)
                .then((result: UserAccountsResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildAccountsResponse());
                })
                .catch(next);
        });
    }

    private signGetUsersRoute() {
        this.router.get("/:id",
            APIMiddleware.isUserEmployee,
            (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.controller
                .getUser(req)
                .then((result: DataResponseBuilder) => {
                    return res
                        .status(result.getStatus())
                        .send(result.buildResponse());
                })
                .catch(next);
        });
    }
}
