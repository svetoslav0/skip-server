import express from "express";
import { UsersController } from "../controllers/users/UsersController";
import { MysqlDatabase } from "../database/MysqlDatabase";
import { UsersModel } from "../models/UsersModel";
import { UserResponseBuilder } from "../controllers/users/UserResponseBuilder";

export class UsersRouter {

    private readonly db: MysqlDatabase;
    private readonly router: express.Router;
    private readonly model: UsersModel;
    private controller: UsersController;
    private responseBuilder: UserResponseBuilder;

    constructor(database: MysqlDatabase) {
        this.db = database;
        this.router = express.Router();
        this.model = new UsersModel(this.db);
        this.controller = new UsersController(this.model);
        this.responseBuilder = new UserResponseBuilder();

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
                .then((result) => {
                    const authToken = result.authToken || "";

                    if (authToken) {
                        res.header("auth-token", authToken);
                    }

                    return res
                        .status(result.httpStatus)
                        .send(
                            this.responseBuilder.buildLoginResponse(result)
                        );
                });
        });
    }

    private signRegisterRoute() {
        this.router.post("/register", (req: express.Request, res: express.Response) => {
            this.controller
                .register(req.body)
                .then((result) => {
                    return res
                        .status(result.httpStatus)
                        .send(
                            this.responseBuilder.buildRegisterResponse(result)
                        );
                });
        });
    }
}
