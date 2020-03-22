import express from "express";
import { ReportsModel } from "../../models/ReportsModel";
import { ReportDTO } from "../../data/reports/ReportDTO";
import { validateOrReject } from "class-validator";
import { ReportEditDTO } from "../../data/reports/ReportEditDTO";

export class ReportsController {
    private readonly SUCCESS_STATUS_CODE: number = 200;
    private readonly BAD_REQUEST_STATUS_CODE: number = 400;
    private readonly INTERNAL_SERVER_ERROR_STATUS_CODE: number = 500;

    private readonly SUCCESSFUL_CREATED_MESSAGE: string = "Report successfully created.";
    private readonly CREATION_FAILED_MESSAGE: string = "Report with the given parameters cannot be created!";
    private readonly UPDATE_FAILED_MESSAGE: string = "Report with the given parameters cannot be update!";
    private readonly MAIN_ERROR_MESSAGE: string = "Something went wrong...";
    private readonly SUCCESSFUL_UPDATE_MESSAGE: string = "Report has been successfully updated.";

    private reportsModel: ReportsModel;

    constructor(reportsModel: ReportsModel) {
        this.reportsModel = reportsModel;
    }

    public async create(request: express.Request): Promise<any> {
        try {
            const report: ReportDTO = new ReportDTO({
                userId: request.body.userId,
                name: request.body.name
            });

            await validateOrReject(report);

            const reportId: number = await this.reportsModel.add(report);

            return {
                httpStatus: this.SUCCESS_STATUS_CODE,
                reportId: reportId,
                success: true,
                message: this.SUCCESSFUL_CREATED_MESSAGE
            }
        } catch (validationError) {
            const errors: string[] = validationError
                .map((error: any) => error.constraints)
                .map((error: any) => Object.values(error))
                .flat();

            return {
                httpStatus: this.BAD_REQUEST_STATUS_CODE,
                success: false,
                message: this.CREATION_FAILED_MESSAGE,
                errors
            }
        }
    }

    public async edit(request: express.Request) {
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

            return {
                httpStatus: this.BAD_REQUEST_STATUS_CODE,
                success: false,
                message: this.UPDATE_FAILED_MESSAGE,
                errors
            }
        }

        const isUpdated: boolean = await this.reportsModel.update(report);

        if (isUpdated) {
            return {
                httpStatus: this.SUCCESS_STATUS_CODE,
                reportId: reportId,
                success: true,
                message: this.SUCCESSFUL_UPDATE_MESSAGE
            }
        }

        errors.push(this.UPDATE_FAILED_MESSAGE);

        return {
            httpStatus: this.INTERNAL_SERVER_ERROR_STATUS_CODE,
            success: false,
            message: this.MAIN_ERROR_MESSAGE,
            errors
        }
    }
}
