import { IUser } from "./IUser";
import {UsersModel} from "../models/UsersModel";

export class UsersController {

    private usersModel: UsersModel;

    constructor(usersModel: UsersModel) {
        this.usersModel = usersModel;
    }

    async register(user: IUser): Promise<boolean> {
        return await this.usersModel.add(user);
    }

    login() {
        return "Login function";
    }
}