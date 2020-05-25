import express from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { BaseController } from "../BaseController";
import { ReportEntitiesRepository } from "../../repositories/ReportEntitiesRepository";
import { ReportEntityDTO } from "../../data/reportEntities/ReportEntityDTO";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { ResponseBuilder } from "../../data/ResponseBuilder";
import { ReportEntityEditDTO } from "../../data/reportEntities/ReportEntityEditDTO";

export class ReportEntitiesController extends BaseController {

    private repository: ReportEntitiesRepository;

    constructor(repository: ReportEntitiesRepository) {
        super();
        this.repository = repository;
    }

    /**
     * @param {express.Request} request
     * @returns {Promise<ResponseBuilder>}
     */
    public async create(request: express.Request): Promise<ResponseBuilder> {
        const responseBuilder = new ResponseBuilder();

        const reportEntity = new ReportEntityDTO(request.userId, request.body);

        try {
            await validateOrReject(reportEntity);

            const reportEntityId: number = await this.repository.add(reportEntity);

            return responseBuilder
                .setHttpStatus(httpStatus.CREATED)
                .setSuccess(true)
                .setResourceId(reportEntityId)
                .setMessage(MESSAGES.SUCCESSES.REPORT_ENTITIES.SUCCESSFUL_CREATION_MESSAGE);

        } catch (validationErrors) {
            const errors: string[] = this.buildValidationErrors(validationErrors);

            return this.buildBadRequestResponse(responseBuilder, errors);
        }
    }

    /**
     * @param {express.Request} request
     * @returns {Promise<ResponseBuilder>}
     */
    public async edit(request: express.Request): Promise<ResponseBuilder> {
        const responseBuilder: ResponseBuilder = new ResponseBuilder();

        this._request = request;

        try {
            this.validateIdParam(request.params.id);
        } catch (error) {
            return responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(MESSAGES.ERRORS.COMMON.FAILED_UPDATING_RESOURCE_MESSAGE)
                .setErrors([error.message]);
        }

        const reportEntityId: number = +request.params.id;

        let entity: ReportEntityEditDTO | null = await this.repository.findById(reportEntityId);

        if (!entity || !entity.id) {
            entity = new ReportEntityEditDTO(reportEntityId, {});
        }

        if (!await this.hasUserAccess(await this.repository.findUserIdById(reportEntityId))) {
            return this.buildForbiddenResponse(responseBuilder);
        }

        try {
            entity.id = reportEntityId;
            entity.classId = request.body.classId || entity.classId;
            entity.classRoleId = request.body.classRoleId || entity.classRoleId;
            entity.reportId = request.body.reportId || entity.reportId;
            entity.hoursSpend = request.body.hoursSpend || entity.hoursSpend;
            entity.date = request.body.date ? new Date(request.body.date) : entity.date;
            entity.userId = request.body.userId || entity.userId;
            entity.description = request.body.description || entity.description;

            await validateOrReject(entity);
        } catch (validationError) {
            const errors: string[] = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(responseBuilder, errors);
        }

        const isUpdated: boolean = await this.repository.update(entity);

        if (isUpdated) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setResourceId(reportEntityId)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.REPORT_ENTITIES.SUCCESSFUL_UPDATED_MESSAGE);
        }

        throw new Error(MESSAGES.ERRORS.COMMON.FAILED_UPDATE_NO_ROWS_AFFECTED_MESSAGE);
    }

    public async archive(request: express.Request): Promise<ResponseBuilder> {
        const responseBuilder: ResponseBuilder = new ResponseBuilder();

        this._request = request;

        try {
            this.validateIdParam(request.params.id);
        } catch (error) {
            return responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(MESSAGES.ERRORS.REPORT_ENTITIES.ARCHIVE_GENERAL_FAILED_MESSAGE)
                .setErrors([error.message]);
        }

        const entityId: number = +request.params.id;

        const entity = await this.repository.findById(entityId);

        if (!entity) {
            return this.buildBadRequestResponse(
                responseBuilder,
                [MESSAGES.ERRORS.REPORT_ENTITIES.ID_FIELD_NOT_EXISTING_MESSAGE]
            );
        }

        if (!await this.hasUserAccess(await this.repository.findUserIdById(entityId))) {
            return this.buildForbiddenResponse(responseBuilder);
        }

        const isArchived: boolean = await this.repository.archive(entityId);

        if (isArchived) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.REPORT_ENTITIES.SUCCESSFUL_ARCHIVED_MESSAGE);
        }

        throw new Error(MESSAGES.ERRORS.COMMON.FAILED_UPDATE_NO_ROWS_AFFECTED_MESSAGE);
    }
}
