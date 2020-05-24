import express from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { BaseController } from "../BaseController";
import { ClassRolesRepository } from "../../repositories/ClassRolesRepository";
import { ClassRoleDTO } from "../../data/classRoles/ClassRoleDTO";
import { ClassRoleEditDTO } from "../../data/classRoles/ClassRoleEditDTO";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { ResponseBuilder } from "../../data/ResponseBuilder";

export class ClassRolesController extends BaseController {

    private repository: ClassRolesRepository;

    constructor(repository: ClassRolesRepository) {
        super();
        this.repository = repository;
    }

    /**
     * @param {express.Request} request
     * @returns {Promise<ResponseBuilder>}
     */
    public async create(request: express.Request): Promise<ResponseBuilder> {
        const responseBuilder: ResponseBuilder = new ResponseBuilder();
        const classRole: ClassRoleDTO = new ClassRoleDTO(request.body);

        try {
            await validateOrReject(classRole);

            const classRoleId: number = await this.repository.add(classRole);

            return responseBuilder
                .setHttpStatus(httpStatus.CREATED)
                .setResourceId(classRoleId)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.CLASS_ROLES.SUCCESSFUL_CREATION_MESSAGE);

        } catch (validationError) {
            const errors: string[] = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(
                responseBuilder, errors
            );
        }
    }

    /**
     * @param {express.Request} request
     * @returns {Promise<ResponseBuilder>}
     */
    public async edit(request: express.Request): Promise<ResponseBuilder> {
        const responseBuilder: ResponseBuilder = new ResponseBuilder();

        try {
            this.validateIdParam(request.params.id);
        } catch (error) {
            return responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(MESSAGES.ERRORS.COMMON.FAILED_UPDATING_RESOURCE_MESSAGE)
                .setErrors([error.message]);
        }

        const classRoleId: number = +request.params.id;

        let classRole: ClassRoleEditDTO | null = await this.repository.findById(classRoleId);

        if (!classRole || !classRole.id || classRole.id !== classRoleId) {
            classRole = new ClassRoleEditDTO(classRoleId, {});
        }

        try {
            classRole
                .setId(classRoleId)
                .setName(request.body.name || classRole.name)
                .setPaymentPerHour(request.body.paymentPerHour || classRole.paymentPerHour)
                .setDescription(request.body.description || classRole.description);

            await validateOrReject(classRole);
        } catch (validationError) {
            const errors: string[] = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(
                responseBuilder, errors
            );
        }

        const isUpdated: boolean = await this.repository.update(classRole);

        if (isUpdated) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setResourceId(classRoleId)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.CLASS_ROLES.SUCCESSFUL_UPDATED_MESSAGE);
        }

        throw new Error(MESSAGES.ERRORS.COMMON.FAILED_UPDATE_NO_ROWS_AFFECTED_MESSAGE);
    }

    public async archive(request: express.Request): Promise<ResponseBuilder> {
        const responseBuilder: ResponseBuilder = new ResponseBuilder();

        try {
            this.validateIdParam(request.params.id);
        } catch (error) {
            return responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(MESSAGES.ERRORS.CLASS_ROLES.ARCHIVE_GENERAL_FAILED_MESSAGE)
                .setErrors([error.message]);
        }

        const classRoleId: number = +request.params.id;

        const classRole: ClassRoleEditDTO | null = await this.repository.findById(classRoleId);

        if (!classRole) {
            return this.buildBadRequestResponse(
                responseBuilder,
                [MESSAGES.ERRORS.CLASS_ROLES.ID_FIELD_NOT_EXISTING_MESSAGE]
            );
        }

        const isArchived: boolean = await this.repository.archive(classRoleId);

        if (isArchived) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.CLASS_ROLES.SUCCESSFUL_ARCHIVED_MESSAGE);
        }

        return this.buildInternalErrorResponse(responseBuilder);
    }
}
