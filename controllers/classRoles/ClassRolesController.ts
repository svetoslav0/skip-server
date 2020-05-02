import express, {request} from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { BaseController } from "../BaseController";
import { ClassRolesModel } from "../../models/ClassRolesModel";
import { ClassRoleDTO } from "../../data/classRoles/ClassRoleDTO";
import { ClassRoleEditDTO } from "../../data/classRoles/ClassRoleEditDTO";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { ResponseBuilder } from "../../data/ResponseBuilder";

export class ClassRolesController extends BaseController {

    private classRoleModel: ClassRolesModel;

    constructor(classRolesModel: ClassRolesModel) {
        super();
        this.classRoleModel = classRolesModel;
    }

    /**
     * This method handles the creation of a class role an its validation
     *
     * @param {express.Request} request
     * @returns {Promise<ResponseBuilder>}
     */
    public async create(request: express.Request): Promise<ResponseBuilder> {
        // const responseBuilder: ClassRolesResponseBuilder = new ClassRolesResponseBuilder();
        const responseBuilder: ResponseBuilder = new ResponseBuilder();
        const classRole: ClassRoleDTO = new ClassRoleDTO(request.body);

        try {
            await validateOrReject(classRole);

            const classRoleId: number = await this.classRoleModel.add(classRole);

            return responseBuilder
                .setHttpStatus(httpStatus.CREATED)
                .setResourceId(classRoleId)
                // .setClassRoleId(classRoleId)
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
     * This method handles updating of a class role and its validations
     *
     * @param {express.Request} request
     * @returns {Promise<ResponseBuilder>}
     */
    public async edit(request: express.Request): Promise<ResponseBuilder> {
        // const responseBuilder: ClassRolesResponseBuilder = new ClassRolesResponseBuilder();
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
        
        let classRole: ClassRoleEditDTO | null =  await this.classRoleModel.findById(classRoleId);

        if (!classRole || !classRole.id || classRole.id !== classRoleId) {
            classRole = new ClassRoleEditDTO(classRoleId, {});
        }

        try {
            classRole
                .setId(classRoleId)
                .setName(request.body.name || classRole.name)
                .setPaymentPerHour(request.body.paymentPerHour || classRole.paymentPerHour);

            await validateOrReject(classRole);
        } catch (validationError) {
            const errors: string[] = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(
                responseBuilder, errors
            );
        }

        const isUpdated: boolean = await this.classRoleModel.update(classRole);

        if (isUpdated) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                // .setClassRoleId(classRoleId)
                .setResourceId(classRoleId)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.CLASS_ROLES.SUCCESSFUL_UPDATED_MESSAGE);
        }

        return this.buildInternalErrorResponse(responseBuilder);
    }

    public async archive(request: express.Request): Promise<ResponseBuilder> {
        // const responseBuilder: ClassRolesResponseBuilder = new ClassRolesResponseBuilder();
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

        const classRole: ClassRoleEditDTO | null = await this.classRoleModel.findById(classRoleId);

        if (!classRole) {
            return this.buildBadRequestResponse(
                responseBuilder,
                [MESSAGES.ERRORS.CLASS_ROLES.ID_FIELD_NOT_EXISTING_MESSAGE]
            );
        }

        const isArchived: boolean = await this.classRoleModel.archive(classRoleId);

        if (isArchived) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.CLASS_ROLES.SUCCESSFUL_ARCHIVED_MESSAGE);
        }

        return this.buildInternalErrorResponse(responseBuilder);
    }
}
