import { IUser } from "./IUser";
import {UsersModel} from "../models/UsersModel";

export class UsersController {

    private usersModel: UsersModel;

    constructor(usersModel: UsersModel) {
        this.usersModel = usersModel;
    }

    register(user: IUser): boolean {
        return this.usersModel.add(user);
    }

    login() {
        return "Login function";
    }
}