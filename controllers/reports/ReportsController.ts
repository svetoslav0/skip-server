import express from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { ReportsRepository } from "../../repositories/ReportsRepository";
import { ReportDTO } from "../../data/reports/ReportDTO";
import { ReportEditDTO } from "../../data/reports/ReportEditDTO";
import { BaseController } from "../BaseController";
import { ROLES } from "../../common/consts/ROLES";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { ResponseBuilder } from "../../data/ResponseBuilder";

export class ReportsController extends BaseController {

    private repository: ReportsRepository;

    constructor(repository: ReportsRepository) {
        super();
        this.repository = repository;
    }

    /**
     * This method handles the creation of a report and its validations
     *
     * @param {express.Request} request
     * @returns {Promise<ResponseBuilder>}
     */
    public async create(request: express.Request): Promise<ResponseBuilder> {
        const responseBuilder: ResponseBuilder = new ResponseBuilder();

        try {
            const report: ReportDTO = new ReportDTO(
                request.userId,
                request.body.name
            );

            await validateOrReject(report);

            const reportId: number = await this.repository.add(report);

            return responseBuilder
                .setHttpStatus(httpStatus.CREATED)
                .setResourceId(reportId)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.REPORTS.SUCCESSFUL_CREATION_MESSAGE);
        } catch (validationError) {
            const errors: string[] = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(responseBuilder, errors);
        }
    }

    /**
     * This method handles the updating of a report and its validations
     *
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

        const reportId: number = +request.params.id;

        let report: ReportEditDTO | null = await this.repository.findById(reportId);

        if (!report || !report.id || report.id !== reportId) {
            report = new ReportEditDTO(reportId, {});
        }

        if (!await this.hasUserAccess(await this.repository.findUserIdById(reportId))) {
            return this.buildForbiddenResponse(responseBuilder);
        }

        let errors: string[] = [];

        try {
            report.id = reportId;
            report.name = request.body.name || report.name;
            report.userId = +request.body.userId || report.userId;

            await validateOrReject(report);
        } catch (validationError) {
            errors = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(responseBuilder, errors);
        }

        const isUpdated: boolean = await this.repository.update(report);

        if (isUpdated) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setResourceId(reportId)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.REPORTS.SUCCESSFUL_UPDATED_MESSAGE);
        }

        return this.buildInternalErrorResponse(responseBuilder);
    }

    /**
     * This method handles the archiving of a report and its validations
     *  The report is not actually deleted, its status is changed in the database.
     *
     * @param {express.Request} request
     * @returns {Promise<ResponseBuilder>}
     */
    public async archive(request: express.Request): Promise<ResponseBuilder> {
        const responseBuilder: ResponseBuilder = new ResponseBuilder();
        // const responseBuilder: ReportsResponseBuilder = new ReportsResponseBuilder();

        this._request = request;

        try {
            this.validateIdParam(request.params.id);
        } catch (error) {
            return responseBuilder
                .setHttpStatus(httpStatus.BAD_REQUEST)
                .setSuccess(false)
                .setMessage(MESSAGES.ERRORS.REPORTS.ARCHIVE_GENERAL_FAILED_MESSAGE)
                .setErrors([error.message]);
        }

        const reportId: number = +request.params.id;

        const report = await this.repository.findById(reportId);

        if (!report) {
            return this.buildBadRequestResponse(
                responseBuilder,
                [MESSAGES.ERRORS.REPORTS.ID_FIELD_NOT_EXISTING_MESSAGE]);
        }

        if (!await this.hasUserAccess(await this.repository.findUserIdById(reportId))) {
            return this.buildForbiddenResponse(responseBuilder);
        }

        const isArchived: boolean = await this.repository.archive(reportId);

        if (isArchived) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setSuccess(true)
                .setMessage(MESSAGES.SUCCESSES.REPORTS.SUCCESSFUL_ARCHIVED_MESSAGE);
        }

        return this.buildInternalErrorResponse(responseBuilder);
    }
}
