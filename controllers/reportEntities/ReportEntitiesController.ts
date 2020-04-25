import express from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { BaseController } from "../BaseController";
import { ReportEntitiesModel } from "../../models/ReportEntitiesModel";
import { ReportEntityDTO } from "../../data/reportEntities/ReportEntityDTO";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { ResponseBuilder } from "../../data/ResponseBuilder";

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
}
