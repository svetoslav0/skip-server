import express from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { ReportsModel } from "../../models/ReportsModel";
import { ReportDTO } from "../../data/reports/ReportDTO";
import { ReportEditDTO } from "../../data/reports/ReportEditDTO";
import { ReportsResponseBuilder } from "../../data/reports/ReportsResponseBuilder";
import { BaseController } from "../BaseController";

export class ReportsController extends BaseController{

    private readonly CONTROLLER_NAME: string = "Report";

    private reportsModel: ReportsModel;

    constructor(reportsModel: ReportsModel) {
        super();
        this.reportsModel = reportsModel;
    }

    public async create(request: express.Request): Promise<ReportsResponseBuilder> {
        const responseBuilder: ReportsResponseBuilder = new ReportsResponseBuilder();

        try {
            const report: ReportDTO = new ReportDTO({
                userId: request.body.userId,
                name: request.body.name
            });

            await validateOrReject(report);

            const reportId: number = await this.reportsModel.add(report);

            responseBuilder
                .setHttpStatus(httpStatus.CREATED)
                .setReportId(reportId)
                .setSuccess(true)
                .setMessage(this.buildSuccessfullyCreatedMessage(this.CONTROLLER_NAME));
        } catch (validationError) {
            const errors: string[] = this.buildValidationErrors(validationError);

            responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(this.buildFailedCreationMessage(this.CONTROLLER_NAME))
                .setErrors(errors);
        }

        return responseBuilder;
    }

    public async edit(request: express.Request): Promise<ReportsResponseBuilder> {
        const responseBuilder: ReportsResponseBuilder = new ReportsResponseBuilder();

        const reportId: number = +request.params.id;

        let report: ReportEditDTO | null = await this.reportsModel.findById(reportId);

        if (!report || !report.id || report.id !== reportId) {
            report = new ReportEditDTO(reportId, {});
        }

        let errors: string[] = [];

        try {
            report.id = reportId;
            report.name = request.body.name || report.name;
            report.userId = +request.body.userId || report.userId;

            await validateOrReject(report);
        } catch (validationError) {
            errors = this.buildValidationErrors(validationError);

            return responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(this.buildFailedUpdatingMessage(this.CONTROLLER_NAME))
                .setErrors(errors);
        }

        const isUpdated: boolean = await this.reportsModel.update(report);

        if (isUpdated) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setReportId(reportId)
                .setSuccess(true)
                .setMessage(this.buildSuccessfullyUpdatedMessage(this.CONTROLLER_NAME));
        }

        return responseBuilder
            .setHttpStatus(httpStatus.INTERNAL_SERVER_ERROR)
            .setSuccess(false)
            .setMessage(this.MAIN_ERROR_MESSAGE)
            .setErrors(errors)
            .fillErrors(this.buildFailedUpdatingMessage(this.CONTROLLER_NAME));
    }

    public async archive(request: express.Request) {
        const responseBuilder: ReportsResponseBuilder = new ReportsResponseBuilder();

        const reportId: number = +request.params.id;

        const report = await this.reportsModel.findById(reportId);

        if (!report) {
            return responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(this.buildFailedArchivingMessage(this.CONTROLLER_NAME));
        }

        const isArchived: boolean = await this.reportsModel.archive(reportId);

        if (isArchived) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setSuccess(true)
                .setMessage(this.buildSuccessfullyArchivedMessage(this.CONTROLLER_NAME));
        }

        return responseBuilder
            .setHttpStatus(httpStatus.INTERNAL_SERVER_ERROR)
            .setSuccess(false)
            .setMessage(this.MAIN_ERROR_MESSAGE);
    }
}
