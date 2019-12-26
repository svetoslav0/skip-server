import {validateOrReject} from "class-validator";
import express from "express";

import { UsersModel } from "../models/UsersModel";
import { UserDTO } from "../data/UserDTO";

export class UsersController {

    readonly REGISTER_SUCCESS_MESSAGE: string = "User registered successfully";
    readonly REGISTER_FAILED_MESSAGE: string = "The given request is invalid. Some errors have appeared.";

    private usersModel: UsersModel;

    constructor(usersModel: UsersModel) {
        this.usersModel = usersModel;
    }

    public async register(request: express.Request): Promise<object>{
        try {
            const user: UserDTO = new UserDTO(request);

            await validateOrReject(user);
            await this.usersModel.isUsernameUnique(user.username);
            await this.usersModel.add(user);

            return this._build_register_response(true, this.REGISTER_SUCCESS_MESSAGE);
        } catch (validationError) {
            const errors: string[] = validationError
                .map((error: any) => error.constraints)
                .map((error: any) => Object.values(error))
                .flat();

            return this._build_register_response(false, this.REGISTER_FAILED_MESSAGE, errors);
        }
    }

    public async login() {
        return "Login function";
    }

    private _build_register_response(success: boolean, message: string, errors: string[] = []): object {
        return {
            success: success,
            message: message,
            errors: errors
        }
    }
}
