import express from "express";
import { validateOrReject } from "class-validator";
import httpStatus from "http-status-codes";

import { ReportsModel } from "../../models/ReportsModel";
import { ReportDTO } from "../../data/reports/ReportDTO";
import { ReportEditDTO } from "../../data/reports/ReportEditDTO";
import { ReportsResponseBuilder } from "../../data/reports/ReportsResponseBuilder";
import { BaseController } from "../BaseController";
import { ROLES } from "../../common/ROLES";
import {AbstractResponseBuilder} from "../../data/AbstractResponseBuilder";

export class ReportsController extends BaseController{

    private readonly CONTROLLER_NAME: string = "Report";

    private reportsModel: ReportsModel;
    private request!: express.Request;

    constructor(reportsModel: ReportsModel) {
        super();
        this.reportsModel = reportsModel;
    }

    /**
     * This method handles the creation of a report and its validations
     *
     * @param {express.Request} request
     * @returns {Promise<AbstractResponseBuilder>>}
     */
    public async create(request: express.Request): Promise<AbstractResponseBuilder> {
        let responseBuilder: ReportsResponseBuilder = new ReportsResponseBuilder();

        try {
            const report: ReportDTO = new ReportDTO({
                userId: request.body.userId,
                name: request.body.name
            });

            await validateOrReject(report);

            const reportId: number = await this.reportsModel.add(report);

            return responseBuilder
                .setHttpStatus(httpStatus.CREATED)
                .setReportId(reportId)
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
     * This method handles the updating of a report and its validations
     *
     * @param {express.Request} request
     * @returns {Promise<AbstractResponseBuilder>>}
     */
    public async edit(request: express.Request): Promise<AbstractResponseBuilder> {
        let responseBuilder = new ReportsResponseBuilder();
        this.request = request;

        const reportId: number = +request.params.id;

        let report: ReportEditDTO | null = await this.reportsModel.findById(reportId);

        if (!report || !report.id || report.id !== reportId) {
            report = new ReportEditDTO(reportId, {});
        }

        if (!await this.hasUserAccess(reportId)) {
            return this.buildForbiddenResponse(responseBuilder, this.CONTROLLER_NAME);
        }

        let errors: string[] = [];

        try {
            report.id = reportId;
            report.name = request.body.name || report.name;
            report.userId = +request.body.userId || report.userId;

            await validateOrReject(report);
        } catch (validationError) {
            errors = this.buildValidationErrors(validationError);

            return this.buildBadRequestResponse(responseBuilder, this.CONTROLLER_NAME, errors);
        }

        const isUpdated: boolean = await this.reportsModel.update(report);

        if (isUpdated) {
            return responseBuilder
                .setHttpStatus(httpStatus.OK)
                .setReportId(reportId)
                .setSuccess(true)
                .setMessage(this.buildSuccessfullyUpdatedMessage(this.CONTROLLER_NAME));
        }

        return this.buildInternalErrorResponse(
            responseBuilder, this.CONTROLLER_NAME
        );
    }

    /**
     * This method handles the archiving of a report and its validations
     *  The report is not actually deleted, its status is changed in the database.
     *
     * @param {express.Request} request
     * @returns {Promise<AbstractResponseBuilder>}
     */
    public async archive(request: express.Request): Promise<AbstractResponseBuilder> {
        const responseBuilder: ReportsResponseBuilder = new ReportsResponseBuilder();
        this.request = request;

        const reportId: number = +request.params.id;

        const report = await this.reportsModel.findById(reportId);

        if (!report) {
            return this.buildBadRequestResponse(responseBuilder, this.CONTROLLER_NAME, []);
        }

        if (!this.hasUserAccess(reportId)) {
            return this.buildForbiddenResponse(responseBuilder, this.CONTROLLER_NAME);
        }

        const isArchived: boolean = await this.reportsModel.archive(reportId);

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

    /**
     * This methods checks if the logged user has access
     *  to edit or delete this report.
     *  NOTE: Admins can edit and delete every report
     *
     * @param {number} reportId
     * @returns {Promise<boolean>}
     */
    private async hasUserAccess(reportId: number): Promise<boolean> {
        if (this.request.roleId === ROLES.ADMIN) {
            return true;
        }

        const ownerId: number = await this.reportsModel.findUserIdById(reportId);

        return ownerId == this.request.userId;
    }
}
