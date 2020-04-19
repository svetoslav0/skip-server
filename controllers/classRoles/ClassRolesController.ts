import express, {request} from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { BaseController } from "../BaseController";
import { ClassRolesModel } from "../../models/ClassRolesModel";
import { AbstractResponseBuilder } from "../../data/AbstractResponseBuilder";
import { ClassRolesResponseBuilder } from "../../data/classRoles/ClassRolesResponseBuilder";
import { ClassRoleDTO } from "../../data/classRoles/ClassRoleDTO";
import { ClassRoleEditDTO } from "../../data/classRoles/ClassRoleEditDTO";

export class ClassRolesController extends BaseController {

    private readonly CONTROLLER_NAME: string = "Class role";

    private classRoleModel: ClassRolesModel;
    private readonly responseBuilder: ClassRolesResponseBuilder;

    constructor(classRolesModel: ClassRolesModel) {
        super();
        this.classRoleModel = classRolesModel;
        this.responseBuilder = new ClassRolesResponseBuilder();
    }

    /**
     * This method handles the creation of a class role an its validation
     *
     * @param {express.Request} request
     * @returns {Promise<AbstractResponseBuilder>}
     */
    public async create(request: express.Request): Promise<AbstractResponseBuilder> {
        const classRole: ClassRoleDTO = new ClassRoleDTO(request.body);

        try {
            await validateOrReject(classRole);

            const classRoleId: number = await this.classRoleModel.add(classRole);

            return this.responseBuilder
                .setHttpStatus(httpStatus.CREATED)
                .setClassRoleId(classRoleId)
                .setSuccess(true)
                .setMessage(this.buildSuccessfullyCreatedMessage(this.CONTROLLER_NAME));

        } catch (validationError) {
            const errors: string[] = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(
                this.responseBuilder, this.CONTROLLER_NAME, errors
            );
        }
    }

    /**
     * This method handles updating of a class role and its validations
     *
     * @param {express.Request} request
     * @returns {Promise<AbstractResponseBuilder>}
     */
    public async edit(request: express.Request): Promise<AbstractResponseBuilder> {
        try {
            this.validateIdParam(request.params.id);
        } catch (errorMessage) {
            return this.responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(errorMessage)
                .setErrors([this.BAD_ID_MESSAGE]);
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
                this.responseBuilder, this.CONTROLLER_NAME, errors
            );
        }

        const isUpdated: boolean = await this.classRoleModel.update(classRole);

        if (isUpdated) {
            return this.responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setClassRoleId(classRoleId)
                .setSuccess(true)
                .setMessage(this.buildSuccessfullyUpdatedMessage(this.CONTROLLER_NAME));
        }

        return this.buildInternalErrorResponse(this.responseBuilder, this.CONTROLLER_NAME);
    }
}
