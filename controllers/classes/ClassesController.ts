import express from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { ClassesRepository } from "../../repositories/ClassesRepository";
import { ClassDTO } from "../../data/classes/ClassDTO";
import { ClassEditDTO } from "../../data/classes/ClassEditDTO";
import { BaseController } from "../BaseController";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { ManipulationsResponseBuilder } from "../../data/ManipulationsResponseBuilder";
import {DataResponseBuilder} from "../../data/DataResponseBuilder";
import {ClassesResponseFormatter} from "./ClassesResponseFormatter";

export class ClassesController extends BaseController {

    private repository: ClassesRepository;

    constructor(repository: ClassesRepository) {
        super();
        this.repository = repository;
    }

    /**
     * @param {express.Request} request
     * @returns {Promise<ManipulationsResponseBuilder>}
     */
    public async create(request: express.Request): Promise<ManipulationsResponseBuilder> {
        const responseBuilder: ManipulationsResponseBuilder = new ManipulationsResponseBuilder();
        const currentClass: ClassDTO = new ClassDTO(request.body);

        try {
            await validateOrReject(currentClass);

            const classId: number = await this.repository.add(currentClass);

            return responseBuilder
                .setHttpStatus(httpStatus.CREATED)
                .setResourceId(classId)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.CLASSES.SUCCESSFUL_CREATION_MESSAGE);

        } catch (validationError) {
            const errors: string[] = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(responseBuilder, errors);
        }
    }

    /**
     * @param {express.Request} request
     * @returns {Promise<ManipulationsResponseBuilder>}
     */
    public async edit(request: express.Request): Promise<ManipulationsResponseBuilder> {
        const responseBuilder: ManipulationsResponseBuilder = new ManipulationsResponseBuilder();

        try {
            this.validateIdParam(request.params.id);
        } catch (error) {
            return responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(MESSAGES.ERRORS.COMMON.FAILED_UPDATING_RESOURCE_MESSAGE)
                .setErrors([error.message]);
        }

        const classId: number = +request.params.id;

        let currentClass: ClassEditDTO | null = await this.repository.findById(classId);
        if (!currentClass || !currentClass.id || currentClass.id !== classId) {
            currentClass = new ClassEditDTO(classId, {});
        }

        try {
            currentClass
                .setId(classId)
                .setName(request.body.name || currentClass.name)
                .setAgeGroup(request.body.ageGroup || currentClass.ageGroup)
                .setDescription(request.body.description || currentClass.description);

            await validateOrReject(currentClass);
        } catch (validationError) {
            const errors: string[] = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(responseBuilder, errors);
        }

        const isUpdated: boolean = await this.repository.update(currentClass);

        if (isUpdated) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setResourceId(classId)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.CLASSES.SUCCESSFUL_UPDATED_MESSAGE);
        }

        return this.buildInternalErrorResponse(responseBuilder);
    }

    /**
     * @param {express.Request} request
     * @returns {Promise<ManipulationsResponseBuilder>}
     */
    public async archive(request: express.Request): Promise<ManipulationsResponseBuilder> {
        const responseBuilder: ManipulationsResponseBuilder = new ManipulationsResponseBuilder();

        try {
            this.validateIdParam(request.params.id);
        } catch (error) {
            return responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(MESSAGES.ERRORS.CLASSES.ARCHIVE_GENERAL_FAILED_MESSAGE)
                .setErrors([error.message]);
        }

        const classId: number = +request.params.id;

        const currentClass = await this.repository.findById(classId);

        if (!currentClass) {
            return this.buildBadRequestResponse(
                responseBuilder,
                [MESSAGES.ERRORS.CLASSES.ID_FIELD_NOT_EXISTING_MESSAGE]);
        }

        const isArchived: boolean = await this.repository.archive(classId);

        if (isArchived) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.CLASSES.SUCCESSFUL_ARCHIVED_MESSAGE);
        }

        return this.buildInternalErrorResponse(responseBuilder);
    }

    /**
     * @return {Promise<DataResponseBuilder>}
     */
    public async getAll(): Promise<DataResponseBuilder> {
        const classesCount: number = await this.repository.findCount();
        const classes: ClassEditDTO[] = await this.repository.findAll();

        const result = new ClassesResponseFormatter().formatAllClasses(classesCount, classes);

        return new DataResponseBuilder(httpStatus.OK, result);
    }

    public async getById(request: express.Request): Promise<DataResponseBuilder> {
        try {
            this.validateIdParam(request.params.id);
        } catch (error) {
            const data = {
                error: error.message
            };
            return new DataResponseBuilder(httpStatus.BAD_REQUEST, data);
        }

        const id: number = +request.params.id;
        const currentClass = await this.repository.findById(id);

        if (!currentClass) {
            const data = {
                error: MESSAGES.ERRORS.CLASSES.ID_FIELD_NOT_EXISTING_MESSAGE
            };
            return new DataResponseBuilder(httpStatus.BAD_REQUEST, data);
        }

        const response = new ClassesResponseFormatter().formatGetClassById(currentClass);
        return new DataResponseBuilder(httpStatus.OK, response);
    }
}
