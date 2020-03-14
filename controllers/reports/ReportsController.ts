import express from "express";
import { ReportsModel } from "../../models/ReportsModel";
import { ReportDTO } from "../../data/reports/ReportDTO";
import { validateOrReject } from "class-validator";

export class ReportsController {
    private readonly SUCCESS_STATUS_CODE: number = 200;
    private readonly BAD_REQUEST_STATUS_CODE: number = 400;
    private readonly RESOURCE_NOT_FOUND_CODE: number = 404;

    private readonly SUCCESSFUL_CREATED_MESSAGE: string = "Report successfully created.";
    private readonly CREATION_FAILED_MESSAGE: string = "Report with the given parameters cannot be created!";
    private readonly UPDATE_FAILED_MESSAGE: string = "Report with the given parameters cannot be update!";
    private readonly MAIN_ERROR_MESSAGE: string = "Something went wrong...";
    private readonly RESOURCE_NOT_FOUND_MESSAGE: string = "Report with the given ID does not exist.";
    private readonly SUCCESSFUL_UPDATE_MESSAGE: string = "Report has been successfully updated.";

    private reportsModel: ReportsModel;

    constructor(reportsModel: ReportsModel) {
        this.reportsModel = reportsModel;
    }

    public async create(request: express.Request): Promise<any> {
        // const dbColumns: string[] = await this.getParsedDatabaseColumnNames();
        // const requiredColumns = new ReportRequestOptionsBuilder().getRequiredColumns(dbColumns);

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

        const report: ReportDTO = await this.reportsModel.findById(reportId);

        if (!report || !report.id || report.id !== reportId) {
            return {
                httpStatus: this.RESOURCE_NOT_FOUND_CODE,
                success: false,
                message: this.MAIN_ERROR_MESSAGE,
                errors: [this.RESOURCE_NOT_FOUND_MESSAGE]
            }
        }

        report.id = reportId;
        report.name = request.body.name || report.name;
        report.userId = +request.body.userId || report.userId;

        try {
            await validateOrReject(report);

            const isUpdated: boolean = await this.reportsModel.update(report);

            if (isUpdated) {
                return {
                    httpStatus: this.SUCCESS_STATUS_CODE,
                    reportId: reportId,
                    success: true,
                    message: this.SUCCESSFUL_UPDATE_MESSAGE
                }
            }

            throw new Error(this.UPDATE_FAILED_MESSAGE);
        } catch (validationError) {
            const errors: string[] = validationError
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
    }
}
