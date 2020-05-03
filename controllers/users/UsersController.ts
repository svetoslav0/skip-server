import { validateOrReject } from "class-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpStatus from "http-status-codes";

import { UsersRepository } from "../../repositories/UsersRepository";
import { UserDTO } from "../../data/users/UserDTO";
import { UsersResponseBuilder } from "../../data/users/UsersResponseBuilder";
import { BaseController } from "../BaseController";
import { MESSAGES } from "../../common/consts/MESSAGES";

export class UsersController extends BaseController {

    private readonly SALT_DIFFICULTY: number = 10;

    private repository: UsersRepository;

    constructor(repository: UsersRepository) {
        super();
        this.repository = repository;
    }

    public async register(request: any): Promise<UsersResponseBuilder> {
        const responseBuilder: UsersResponseBuilder = new UsersResponseBuilder();

        try {
            const user: UserDTO = new UserDTO(request);

            await validateOrReject(user);
            await this.repository.isUsernameUnique(user.username);

            const salt: string = await bcrypt.genSalt(this.SALT_DIFFICULTY);
            user.password = await bcrypt.hash(user.password, salt);

            const userId: number = await this.repository.add(user);

            return responseBuilder
                .setHttpStatus(httpStatus.CREATED)
                .setUserId(userId)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.USERS.REGISTER_SUCCESS_MESSAGE);

        } catch (validationError) {
            const errors: string[] = this.buildValidationErrors(validationError);

            return responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(MESSAGES.ERRORS.USERS.REGISTER_FAILED_MESSAGE)
                .setErrors(errors);
        }
    }

    public async login(request: any): Promise<UsersResponseBuilder> {
        const responseBuilder: UsersResponseBuilder = new UsersResponseBuilder();

        const user = await this.repository
            .findByUsername(
                (new UserDTO(request)).username
            );

        const isPasswordValid: boolean = await bcrypt.compare(request.password || "", user ? user.password : "");

        if (!isPasswordValid || !user) {
            return responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(MESSAGES.ERRORS.USERS.LOGIN_FAILED_MESSAGE);
        }

        const payload = {
            userId: user.id,
            roleId: user.roleId
        };

        const token = jwt.sign(payload, process.env.TOKEN_SECRET || "");

        return responseBuilder
            .setHttpStatus(httpStatus.OK)
            .setSuccess(true)
            .setMessage(MESSAGES.SUCCESSES.USERS.LOGIN_SUCCESS_MESSAGE)
            .setAuthToken(token);
    }

    public async remove(request: any): Promise<any> {
        const result = await this.repository
            .removeById(request.userId);
    }
}
