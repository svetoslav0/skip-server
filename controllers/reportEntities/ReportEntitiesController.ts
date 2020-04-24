import express from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { BaseController } from "../BaseController";
import { ReportEntitiesModel } from "../../models/ReportEntitiesModel";
import { AbstractResponseBuilder } from "../../data/AbstractResponseBuilder";
import { ReportEntitiesResponseBuilder } from "../../data/reportEntities/ReportEntitiesResponseBuilder";
import { ReportEntityDTO } from "../../data/reportEntities/ReportEntityDTO";
import { MESSAGES } from "../../common/consts/MESSAGES";

export class ReportEntitiesController extends BaseController {

    private readonly CONTROLLER_NAME: string = "Report Entity";

    private model: ReportEntitiesModel;

    constructor(model: ReportEntitiesModel) {
        super();
        this.model = model;
    }

    public async create(request: express.Request): Promise<AbstractResponseBuilder> {
        const responseBuilder = new ReportEntitiesResponseBuilder();
        const reportEntity = new ReportEntityDTO(request.body);

        try {
            await validateOrReject(reportEntity);

            const reportEntityId: number = await this.model.add(reportEntity);

            return responseBuilder
                .setHttpStatus(httpStatus.CREATED)
                .setSuccess(true)
                .setReportEntityId(reportEntityId)
                .setMessage(MESSAGES.SUCCESSES.REPORT_ENTITIES.SUCCESSFUL_CREATION_MESSAGE);
        } catch (validationErrors) {
            const errors: string[] = this.buildValidationErrors(validationErrors);

            return this.buildBadRequestResponse(
                responseBuilder, this.CONTROLLER_NAME, errors
            );
        }
    }
}
