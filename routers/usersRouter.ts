import express from "express";
import { UsersController } from "../controllers/users/UsersController";
import { MysqlDatabase } from "../database/MysqlDatabase";
import { UsersModel } from "../models/UsersModel";
import { UserResponseBuilder } from "../controllers/users/UserResponseBuilder";
import { UsersMiddleware } from "../controllers/users/UsersMiddleware";

const usersRouter = express.Router();

const db: MysqlDatabase = new MysqlDatabase();
const usersModel: UsersModel = new UsersModel(db);
const usersController: UsersController = new UsersController(usersModel);

usersRouter.post("/register", (req: express.Request, res: express.Response) => {
    usersController
        .register(req.body)
        .then((result) => {
            return res
                .status(result.httpStatus)
                .send(
                    new UserResponseBuilder().buildRegisterResponse(result)
                );
        });
});

usersRouter.post("/login", (req: express.Request, res: express.Response) => {
    usersController
        .login(req.body)
        .then((result) => {
            return res
                .header("auth-token", result.authToken || "")
                .status(result.httpStatus)
                .send(
                    new UserResponseBuilder().buildLoginResponse(result)
                );
        });
});

export { usersRouter };
