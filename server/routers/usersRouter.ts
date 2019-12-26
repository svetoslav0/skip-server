import express from "express";
import { UsersController } from "../controllers/UsersController";
import { MysqlDatabase } from "../database/MysqlDatabase";
import { UsersModel } from "../models/UsersModel";
import { UserDTO } from "../data/UserDTO";

const usersRouter = express.Router();

const db: MysqlDatabase = new MysqlDatabase();
const usersModel: UsersModel = new UsersModel(db);
const usersController: UsersController = new UsersController(usersModel);

usersRouter.get("/register", (req: express.Request, res: express.Response) => {
    usersController
        .register(req.body)
        .then((result) => {
            res.send(result);
        });
});

usersRouter.get("/login", (req: express.Request, res: express.Response) => {
   // res.send(
   //     usersController.login(
   //
   //     )
   // );
});

export { usersRouter };
