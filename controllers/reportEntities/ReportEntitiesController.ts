import express from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { BaseController } from "../BaseController";
import { ReportEntitiesModel } from "../../models/ReportEntitiesModel";
import { ReportEntityDTO } from "../../data/reportEntities/ReportEntityDTO";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { ResponseBuilder } from "../../data/ResponseBuilder";
import { ReportEntityEditDTO } from "../../data/reportEntities/ReportEntityEditDTO";

export class ReportEntitiesController extends BaseController {

    private model: ReportEntitiesModel;

    constructor(model: ReportEntitiesModel) {
        super();
        this.model = model;
    }

    /**
     * This method handles the creation of a Report Entity and its validations
     *
     * @param {express.Request} request
     * @returns {Promise<ResponseBuilder>}
     */
    public async create(request: express.Request): Promise<ResponseBuilder> {
        const responseBuilder = new ResponseBuilder();

        const reportEntity = new ReportEntityDTO(request.body);

        try {
            await validateOrReject(reportEntity);

            const reportEntityId: number = await this.model.add(reportEntity);

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

        let entity: ReportEntityEditDTO | null = await this.model.findById(reportEntityId);

        if (!entity || !entity.id) {
            entity = new ReportEntityEditDTO(reportEntityId, {});
        }

        if(!await this.hasUserAccess(await this.model.findUserIdById(reportEntityId))) {
            return this.buildForbiddenResponse(responseBuilder);
        }

        try {
            entity.id = reportEntityId;
            entity.classId = request.body.classId || entity.classId;
            entity.classRoleId = request.body.classRoleId || entity.classRoleId;
            entity.reportId = request.body.reportId || entity.reportId;
            entity.hoursSpend = +request.body.hoursSpend || entity.hoursSpend;
            entity.date = new Date(request.body.date) || entity.date;
            entity.userId = request.body.userId || entity.userId;

            await validateOrReject(entity);
        } catch (validationError) {
            const errors: string[] = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(responseBuilder, errors);
        }

        const isUpdated: boolean = await this.model.update(entity);

        if (isUpdated) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setResourceId(reportEntityId)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.REPORT_ENTITIES.SUCCESSFUL_UPDATED_MESSAGE);
        }

        throw new Error(MESSAGES.ERRORS.COMMON.FAILED_UPDATE_NO_ROWS_AFFECTED_MESSAGE);
    }
}
