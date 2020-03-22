import {validateOrReject} from "class-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UsersModel } from "../../models/UsersModel";
import { UserDTO } from "../../data/users/UserDTO";
import { UsersResponseBuilder } from "../../data/users/UsersResponseBuilder";

export class UsersController {

    private readonly SALT_DIFFICULTY: number = 10;

    private readonly SUCCESS_LOGIN_STATUS_CODE: number = 200;
    private readonly SUCCESS_REGISTER_STATUS_CODE: number = 201;
    private readonly BAD_REQUEST_STATUS_CODE: number = 400;

    private readonly REGISTER_SUCCESS_MESSAGE: string = "User registered successfully.";
    private readonly REGISTER_FAILED_MESSAGE: string = "The given request is invalid. Some errors have appeared.";

    private readonly UNSUCCESSFUL_LOGIN_MESSAGE: string = "Wrong username or password.";
    private readonly SUCCESS_LOGIN_MESSAGE: string = "Logged in successfully";

    private usersModel: UsersModel;

    constructor(usersModel: UsersModel) {
        this.usersModel = usersModel;
    }

    public async register(request: any): Promise<UsersResponseBuilder> {
        const responseBuilder: UsersResponseBuilder = new UsersResponseBuilder();

        try {
            const user: UserDTO = new UserDTO(request);

            await validateOrReject(user);
            await this.usersModel.isUsernameUnique(user.username);

            const salt: string = await bcrypt.genSalt(this.SALT_DIFFICULTY);
            user.password = await bcrypt.hash(user.password, salt);

            const userId: number = await this.usersModel.add(user);

            return responseBuilder
                .setHttpStatus(this.SUCCESS_REGISTER_STATUS_CODE)
                .setUserId(userId)
                .setSuccess(true)
                .setMessage(this.REGISTER_SUCCESS_MESSAGE);

        } catch (validationError) {
            const errors: string[] = validationError
                .map((error: any) => error.constraints)
                .map((error: any) => Object.values(error))
                .flat();

            return responseBuilder
                .setHttpStatus(this.BAD_REQUEST_STATUS_CODE)
                .setSuccess(false)
                .setMessage(this.REGISTER_FAILED_MESSAGE)
                .setErrors(errors);
        }
    }

    public async login(request: any): Promise<UsersResponseBuilder> {
        const responseBuilder: UsersResponseBuilder = new UsersResponseBuilder();

        const user = await this.usersModel
            .findByUsername(
                (new UserDTO(request)).username
            );

        const isPasswordValid: boolean = await bcrypt.compare(request.password || "", user ? user.password : "");

        if (!isPasswordValid || !user) {
            return responseBuilder
                .setHttpStatus(this.BAD_REQUEST_STATUS_CODE)
                .setSuccess(false)
                .setMessage(this.UNSUCCESSFUL_LOGIN_MESSAGE);
        }

        const payload = {
            userId: user.id,
            roleId: user.roleId
        };

        const token = jwt.sign(payload, process.env.TOKEN_SECRET || "");

        return responseBuilder
            .setHttpStatus(this.SUCCESS_LOGIN_STATUS_CODE)
            .setSuccess(true)
            .setMessage(this.SUCCESS_LOGIN_MESSAGE)
            .setAuthToken(token);
    }

    public async remove(request: any): Promise<any> {
        const result = await this.usersModel
            .removeById(request.userId);
    }
}
