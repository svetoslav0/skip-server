import express from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { ReportsRepository } from "../../repositories/ReportsRepository";
import { ReportDTO } from "../../data/reports/ReportDTO";
import { ReportEditDTO } from "../../data/reports/ReportEditDTO";
import { BaseController } from "../BaseController";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { ManipulationsResponseBuilder } from "../../data/ManipulationsResponseBuilder";
import {DataResponseBuilder} from "../../data/DataResponseBuilder";
import {ReportEntitiesRepository} from "../../repositories/ReportEntitiesRepository";
import {ReportsResponseFormatter} from "./ReportsResponseFormatter";

export class ReportsController extends BaseController {

    private repository: ReportsRepository;

    constructor(repository: ReportsRepository) {
        super();
        this.repository = repository;
    }

    /**
     * @param {express.Request} request
     * @returns {Promise<ManipulationsResponseBuilder>}
     */
    public async create(request: express.Request): Promise<ManipulationsResponseBuilder> {
        const responseBuilder: ManipulationsResponseBuilder = new ManipulationsResponseBuilder();

        try {
            const report: ReportDTO = new ReportDTO(
                request.userId,
                request.body
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
     * @param {express.Request} request
     * @returns {Promise<ManipulationsResponseBuilder>}
     */
    public async edit(request: express.Request): Promise<ManipulationsResponseBuilder> {
        const responseBuilder: ManipulationsResponseBuilder = new ManipulationsResponseBuilder();

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
            report.description = request.body.description || report.description;

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
     * @param {express.Request} request
     * @returns {Promise<ManipulationsResponseBuilder>}
     */
    public async archive(request: express.Request): Promise<ManipulationsResponseBuilder> {
        const responseBuilder: ManipulationsResponseBuilder = new ManipulationsResponseBuilder();

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
                [MESSAGES.ERRORS.REPORTS.ID_FIELD_NOT_EXISTING_MESSAGE]
            );
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

    /**
     * @param {express.Request} request
     * @return {Promise<ManipulationsResponseBuilder>}
     */
    public async getReport(request: express.Request): Promise<DataResponseBuilder> {
        try {
            this.validateIdParam(request.params.id);
        } catch (error) {
            const data = {
                error: error.message
            };
            return new DataResponseBuilder(httpStatus.BAD_REQUEST, data);
        }

        const id: number = +request.params.id;

        try {
            const result = await this.getReportById(id);
            return new DataResponseBuilder(httpStatus.OK, result);
        } catch (error) {
            const data = {
                error: error.message
            };
            return new DataResponseBuilder(httpStatus.BAD_REQUEST, data);
        }

    }

    /**
     * @param {express.Request} request
     */
    public async getReportsByUserId(request: express.Request): Promise<DataResponseBuilder> {
        const userId: number = request.userId;

        const reportsCount: number = await this.repository.findReportsCountByUserId(userId);

        const reportIds: number[] = await this.repository.findReportIdsByUserId(userId);
        const reports = await Promise.all(
            reportIds.map((id: number) => {
                return this.getReportById(id);
            })
        );

        const result = new ReportsResponseFormatter().formatGetReportsForUserId(reportsCount, reports);

        return new DataResponseBuilder(200, result);
    }

    /**
     * @param {number} id
     * @throws Error
     */
    private async getReportById(id: number) {
        const report = await this.repository.findById(id);

        if (!report) {
            throw new Error(MESSAGES.ERRORS.REPORTS.ID_FIELD_NOT_EXISTING_MESSAGE);
        }

        const entities = await this.repository.findEntitiesByReportId(id);
        return new ReportsResponseFormatter().formatGetReport(report, entities);
    }
}
