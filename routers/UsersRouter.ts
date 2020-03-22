import express from "express";
import { UsersController } from "../controllers/users/UsersController";
import { MysqlDatabase } from "../database/MysqlDatabase";
import { UsersModel } from "../models/UsersModel";
import { UsersResponseBuilder } from "../data/users/UsersResponseBuilder";

export class UsersRouter {

    private readonly db: MysqlDatabase;
    private readonly router: express.Router;
    private readonly model: UsersModel;
    private controller: UsersController;

    constructor(database: MysqlDatabase) {
        this.db = database;
        this.router = express.Router();
        this.model = new UsersModel(this.db);
        this.controller = new UsersController(this.model);

        this.registerRoutes();
    }

    public registerRoutes(): express.Router {
        this.signLoginRoute();
        this.signRegisterRoute();

        return this.router;
    }

    private signLoginRoute() {
        this.router.post("/login", (req: express.Request, res: express.Response) => {
            this.controller
                .login(req.body)
                .then((result: UsersResponseBuilder) => {
                    const authToken = result.authToken || "";

                    if (authToken) {
                        res.header("auth-token", authToken);
                    }

                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                });
        });
    }

    private signRegisterRoute() {
        this.router.post("/register", (req: express.Request, res: express.Response) => {
            this.controller
                .register(req.body)
                .then((result: UsersResponseBuilder) => {
                    return res
                        .status(result.httpStatus)
                        .send(result.buildResponse());
                });
        });
    }
}
