import {validateOrReject} from "class-validator";
import express from "express";

import { UsersModel } from "../models/UsersModel";
import { UserDTO } from "../data/UserDTO";
import {IRegisterResponse} from "./IRegisterResponse";

export class UsersController {

    private readonly SUCCESS_STATUS_CODE: number = 200;
    private readonly FAILED_STATUS_CODE: number = 403;

    private readonly REGISTER_SUCCESS_MESSAGE: string = "User registered successfully";
    private readonly REGISTER_FAILED_MESSAGE: string = "The given request is invalid. Some errors have appeared.";

    private usersModel: UsersModel;

    constructor(usersModel: UsersModel) {
        this.usersModel = usersModel;
    }

    public async register(request: express.Request): Promise<IRegisterResponse> {
        try {
            const user: UserDTO = new UserDTO(request);

            await validateOrReject(user);
            await this.usersModel.isUsernameUnique(user.username);
            await this.usersModel.add(user);

            return this._build_register_response({
                status: this.SUCCESS_STATUS_CODE,
                success: true,
                message: this.REGISTER_SUCCESS_MESSAGE,
            });
        } catch (validationError) {
            const errors: string[] = validationError
                .map((error: any) => error.constraints)
                .map((error: any) => Object.values(error))
                .flat();

            return this._build_register_response({
                status: this.FAILED_STATUS_CODE,
                success: false,
                message: this.REGISTER_FAILED_MESSAGE,
                errors,
            });
        }
    }

    public async login() {
        return "Login function";
    }

    private _build_register_response(options: IRegisterResponse): IRegisterResponse {
        return {
            status: options.status,
            success: options.success,
            message: options.message,
            errors: options.errors ? options.errors : [],
        };
    }
}
