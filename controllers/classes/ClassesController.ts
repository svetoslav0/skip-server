import express from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { ClassesModel } from "../../models/ClassesModel";
import { ClassesDTO } from "../../data/classes/ClassesDTO";
import { ClassesEditDTO } from "../../data/classes/ClassesEditDTO";
import { ClassesResponseBuilder } from "../../data/classes/ClassesResponseBuilder";
import { BaseController } from "../BaseController";
import { AbstractResponseBuilder } from "../../data/AbstractResponseBuilder";

export class ClassesController extends BaseController {

    private readonly CONTROLLER_NAME: string = "Class";

    private classesModel: ClassesModel;

    constructor(classesModel: ClassesModel) {
        super();
        this.classesModel = classesModel;
    }

    /**
     * This method handles the creation of a class and its validations
     *
     * @param {express.Request} request
     * @returns {Promise<AbstractResponseBuilder>}
     */
    public async create(request: express.Request): Promise<AbstractResponseBuilder> {
        const responseBuilder: ClassesResponseBuilder = new ClassesResponseBuilder();

        try {
            const currentClass: ClassesDTO = new ClassesDTO(request.body);

            await validateOrReject(currentClass);

            const classId: number = await this.classesModel.add(currentClass);

            return responseBuilder
                .setHttpStatus(httpStatus.CREATED)
                .setClassId(classId)
                .setSuccess(true)
                .setMessage(this.buildSuccessfullyCreatedMessage(this.CONTROLLER_NAME));

        } catch (validationError) {
            const errors: string[] = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(
                responseBuilder, this.CONTROLLER_NAME, errors
            );
        }
    }

    /**
     * This method handles the updating of a class and its validations
     *
     * @param {express.Request} request
     * @returns {Promise<AbstractResponseBuilder>}
     */
    public async edit(request: express.Request): Promise<AbstractResponseBuilder> {
        const responseBuilder: ClassesResponseBuilder = new ClassesResponseBuilder();

        const classId: number = +request.params.id;

        let currentClass: ClassesEditDTO | null = await this.classesModel.findById(classId);

        if (!currentClass || !currentClass.id || currentClass.id !== classId) {
            currentClass = new ClassesEditDTO(classId, {});
        }

        let errors: string[] = [];

        try {
            currentClass
                .setId(classId)
                .setName(request.body.name || currentClass.name)
                .setAgeGroup(request.body.ageGroup || currentClass.ageGroup);

            await validateOrReject(currentClass);
        } catch (validationError) {
            errors = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(
                responseBuilder, this.CONTROLLER_NAME, errors
            );
        }

        const isUpdated: boolean = await this.classesModel.update(currentClass);

        if (isUpdated) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setClassId(classId)
                .setSuccess(true)
                .setMessage(this.buildSuccessfullyUpdatedMessage(this.CONTROLLER_NAME))
        }

        return this.buildInternalErrorResponse(responseBuilder, this.CONTROLLER_NAME);
    }

    /**
     * This method handles the archiving of a class and its validations
     *  The class is not actually deleted, its status is changed in the database.
     *
     * @param {express.Request} request
     * @returns {Promise<AbstractResponseBuilder>}
     */
    public async archive(request: express.Request): Promise<AbstractResponseBuilder> {
        const responseBuilder: ClassesResponseBuilder = new ClassesResponseBuilder();

        const classId: number = +request.params.id;

        const currentClass = await this.classesModel.findById(classId);

        if (!currentClass) {
            return this.buildBadRequestResponse(responseBuilder, this.CONTROLLER_NAME, [])
        }

        const isArchived: boolean = await this.classesModel.archive(classId);

        if (isArchived) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setSuccess(true)
                .setMessage(this.buildSuccessfullyArchivedMessage(this.CONTROLLER_NAME));
        }

        return this.buildInternalErrorResponse(
            responseBuilder, this.CONTROLLER_NAME
        );
    }
}
