import express from "express";
import { ReportsModel } from "../../models/ReportsModel";
import { ReportDTO } from "../../data/reports/ReportDTO";
import { validateOrReject } from "class-validator";
import { ReportEditDTO } from "../../data/reports/ReportEditDTO";
import { ReportsResponseBuilder } from "../../data/reports/ReportsResponseBuilder";

export class ReportsController {
    private readonly SUCCESS_STATUS_CODE: number = 200;
    private readonly BAD_REQUEST_STATUS_CODE: number = 400;
    private readonly INTERNAL_SERVER_ERROR_STATUS_CODE: number = 500;

    private readonly SUCCESSFUL_CREATED_MESSAGE: string = "Report successfully created.";
    private readonly SUCCESSFUL_UPDATE_MESSAGE: string = "Report has been successfully updated.";
    private readonly SUCCESSFUL_ARCHIVED_MESSAGE: string = "Report has been successfully archived";
    private readonly CREATION_FAILED_MESSAGE: string = "Report with the given parameters cannot be created!";
    private readonly UPDATE_FAILED_MESSAGE: string = "Report with the given parameters cannot be update!";
    private readonly ARCHIVE_FAILED_MESSAGE: string = "Report with the given 'id' cannot be updated!";
    private readonly MAIN_ERROR_MESSAGE: string = "Something went wrong...";

    private reportsModel: ReportsModel;

    constructor(reportsModel: ReportsModel) {
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
                .setHttpStatus(this.SUCCESS_STATUS_CODE)
                .setReportId(reportId)
                .setSuccess(true)
                .setMessage(this.SUCCESSFUL_CREATED_MESSAGE);

            return responseBuilder;
        } catch (validationError) {
            const errors: string[] = validationError
                .map((error: any) => error.constraints)
                .map((error: any) => Object.values(error))
                .flat();

            responseBuilder
                .setHttpStatus(this.BAD_REQUEST_STATUS_CODE)
                .setSuccess(false)
                .setMessage(this.CREATION_FAILED_MESSAGE)
                .setErrors(errors);

            return responseBuilder;
        }
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
            errors = validationError
                .map((error: any) => error.constraints)
                .map((error: any) => Object.values(error))
                .flat();

            responseBuilder
                .setHttpStatus(this.BAD_REQUEST_STATUS_CODE)
                .setSuccess(false)
                .setMessage(this.UPDATE_FAILED_MESSAGE)
                .setErrors(errors);

            return responseBuilder;
        }

        const isUpdated: boolean = await this.reportsModel.update(report);

        if (isUpdated) {
            responseBuilder
                .setHttpStatus(this.SUCCESS_STATUS_CODE)
                .setReportId(reportId)
                .setSuccess(true)
                .setMessage(this.SUCCESSFUL_UPDATE_MESSAGE);

            return responseBuilder;
        }

        responseBuilder
            .setHttpStatus(this.INTERNAL_SERVER_ERROR_STATUS_CODE)
            .setSuccess(false)
            .setMessage(this.MAIN_ERROR_MESSAGE)
            .setErrors(errors)
            .fillErrors(this.UPDATE_FAILED_MESSAGE);

        return responseBuilder;
    }

    public async archive(request: express.Request) {
        const responseBuilder: ReportsResponseBuilder = new ReportsResponseBuilder();

        const reportId: number = +request.params.id;

        const report = await this.reportsModel.findById(reportId);

        if (!report) {
            return responseBuilder
                .setHttpStatus(this.BAD_REQUEST_STATUS_CODE)
                .setSuccess(false)
                .setMessage(this.ARCHIVE_FAILED_MESSAGE);
        }

        const isArchived: boolean = await this.reportsModel.archive(reportId);

        if (isArchived) {
            return responseBuilder
                .setHttpStatus(this.SUCCESS_STATUS_CODE)
                .setSuccess(true)
                .setMessage(this.SUCCESSFUL_ARCHIVED_MESSAGE);
        }

        return responseBuilder
            .setHttpStatus(this.INTERNAL_SERVER_ERROR_STATUS_CODE)
            .setSuccess(false)
            .setMessage(this.MAIN_ERROR_MESSAGE);
    }
}
