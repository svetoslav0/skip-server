import { UsersModel } from "../models/UsersModel";
import { IUser } from "./IUser";

export class UsersController {

    private usersModel: UsersModel;

    constructor(usersModel: UsersModel) {
        this.usersModel = usersModel;
    }

    public async register(user: IUser): Promise<boolean> {
        return await this.usersModel.add(user);
    }

    public async login() {
        return "Login function";
    }
}
