import { IUser } from '../controllers/IUser';

import express from 'express';
import { UsersController } from '../controllers/UsersController';
import {UsersModel} from "../models/UsersModel";

const usersRouter = express.Router();
const usersModel: UsersModel = new UsersModel();
const usersController: UsersController = new UsersController(usersModel);

usersRouter.get('/register', (req: express.Request, res: express.Response) => {
    res.send(
        usersController.register(
            req.body as IUser
        )
    );
});

usersRouter.get('/login', (req: express.Request, res: express.Response) => {
   res.send(
       usersController.login(

       )
   );
});


export { usersRouter };