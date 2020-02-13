import express from "express";
import {ReportsModel} from "../../models/ReportsModel";
import {ReportDTO} from "../../data/ReportDTO";
import {ReportRequestOptionsBuilder} from "./ReportRequestOptionsBuilder";

export class ReportsController {
    private readonly SUCCESS_STATUS_CODE: number = 200;
    private readonly BAD_REQUEST_STATUS_CODE: number = 400;
    private readonly RESOURCE_NOT_FOUND_CODE: number = 404;

    private readonly SUCCESSFUL_CREATED_MESSAGE: string = "Report successfully created.";
    private readonly MAIN_ERROR_MESSAGE: string = "Something went wrong...";
    private readonly RESOURCE_NOT_FOUND_MESSAGE: string = "Report with the given ID does not exist.";
    private readonly SUCCESSFUL_UPDATE_MESSAGE: string = "Report has been successfully updated.";

    private reportsModel: ReportsModel;

    constructor(reportsModel: ReportsModel) {
        this.reportsModel = reportsModel;
    }

    public async create(request: express.Request): Promise<any> {
        const dbColumns: string[] = await this.getParsedDatabaseColumnNames();
        const requiredColumns = new ReportRequestOptionsBuilder().getRequiredColumns(dbColumns);

        try {
            this.proceedMissingParams(request.body, requiredColumns);
        } catch (e) {
            return {
                httpStatus: this.BAD_REQUEST_STATUS_CODE,
                success: false,
                message: e.message
            }
        }

        const report: ReportDTO = new ReportDTO({
            userId: request.userId,
            name: request.body.name
        });

        const reportId: number = await this.reportsModel.add(report);

        return {
            httpStatus: this.SUCCESS_STATUS_CODE,
            reportId: reportId,
            success: true,
            message: this.SUCCESSFUL_CREATED_MESSAGE
        }
    }

    public async edit(request: express.Request) {
        const reportId: number = +request.params.id;

        const databaseFields: string[] = await this.getParsedDatabaseColumnNames();

        const report: ReportDTO = await this.reportsModel.findById(reportId);

        if (report.id != reportId) {
            return {
                httpStatus: this.RESOURCE_NOT_FOUND_CODE,
                success: false,
                message: this.MAIN_ERROR_MESSAGE,
                errors: [this.RESOURCE_NOT_FOUND_MESSAGE]
            }
        }

        report.id = reportId;

        const requestOptions = new ReportRequestOptionsBuilder().editOptionsBuilder(request.body, databaseFields);

        Object.keys(requestOptions)
            .forEach(key => {
                // @ts-ignore
                report[key] = requestOptions[key];
            });

        const isUpdated: boolean = await this.reportsModel.update(report);

        if (isUpdated) {
            return {
                httpStatus: this.SUCCESS_STATUS_CODE,
                reportId: reportId,
                success: true,
                message: this.SUCCESSFUL_UPDATE_MESSAGE
            }
        }

        return {
            httpStatus: 400,
            success: false,
            message: "Something went wrong..."
        };
    }

    private proceedMissingParams(reqBody: any, dbColumns: string[]) {
        dbColumns.forEach(column => {
            if (!reqBody[column]) {
                throw new TypeError(`The parameter '${column}' is required!`);
            }
        });
    }

    private async getParsedDatabaseColumnNames() {
        return this.mapSnakeCaseToCamelCase(await this.reportsModel.getTableFields());
    }

    private mapSnakeCaseToCamelCase(fields: string[]) {
        return fields
            .map(s => {
                return s.replace(/([-_][a-z])/ig, ($1: string) => {
                    return $1.toUpperCase()
                        .replace('-', '')
                        .replace('_', '');
                });
            });
    }
}
