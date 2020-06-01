import { validateOrReject } from "class-validator";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpStatus from "http-status-codes";

import { UsersRepository } from "../../repositories/UsersRepository";
import { UserDTO } from "../../data/users/UserDTO";
import { UserAccountsResponseBuilder } from "../../data/users/UserAccountsResponseBuilder";
import { BaseController } from "../BaseController";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { UsersResponseFormatter } from "./UsersResponseFormatter";
import { DataResponseBuilder } from "../../data/DataResponseBuilder";

export class UsersController extends BaseController {

    private readonly SALT_DIFFICULTY: number = 10;

    private repository: UsersRepository;
    private formatter: UsersResponseFormatter;

    constructor(repository: UsersRepository, usersFormatter: UsersResponseFormatter) {
        super();
        this.repository = repository;
        this.formatter = usersFormatter;
    }

    /**
     * @param request
     * @return {Promise<UserAccountsResponseBuilder>}
     */
    public async register(request: any): Promise<UserAccountsResponseBuilder> {
        const responseBuilder: UserAccountsResponseBuilder = new UserAccountsResponseBuilder();

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

    /**
     * @param requestBody
     * @return {Promise<UserAccountsResponseBuilder>}
     */
    public async login(requestBody: any): Promise<UserAccountsResponseBuilder> {
        const responseBuilder: UserAccountsResponseBuilder = new UserAccountsResponseBuilder();

        const user = await this.repository
            .findByUsername(
                (new UserDTO(requestBody)).username
            );

        const isPasswordValid: boolean = await bcrypt.compare(requestBody.password || "", user ? user.password : "");

        if (!isPasswordValid || !user) {
            return responseBuilder
                .setHttpStatus(httpStatus.UNAUTHORIZED)
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

    /**
     * @param {express.Request} request
     * @return {Promise<DataResponseBuilder>}
     */
    public async getUser(request: express.Request): Promise<DataResponseBuilder> {
        try {
            this.validateIdParam(request.params.id);
        } catch (error) {
            const data = {
                error: error.message
            };
            return new DataResponseBuilder(httpStatus.BAD_REQUEST, data);
        }
        const userId: number = +request.params.id;

        try {
            const user: UserDTO = await this.repository.findById(userId);

            const data = this.formatter.formatGetUser(user);
            return new DataResponseBuilder(httpStatus.OK, data);
        } catch (error) {
            const data = {
                error: error.message
            };
            return new DataResponseBuilder(httpStatus.BAD_REQUEST, data);
        }
    }

    /**
     * @param {express.Request} request
     */
    public async remove(request: express.Request): Promise<any> {
        const result = await this.repository
            .removeById(request.userId);
    }
}
