import {ReportsModel} from "../../models/ReportsModel";
import {ReportDTO} from "../../data/ReportDTO";

export class ReportsController {
    private readonly SUCCESS_STATUS_CODE: number = 200;
    private readonly SUCCESS_MESSAGE: string = "Report successfully created.";

    private reportsModel: ReportsModel;

    constructor(reportsModel: ReportsModel) {
        this.reportsModel = reportsModel;
    }

    public async create(request: any): Promise<any> {
        const report: ReportDTO = new ReportDTO(request);

        const reportId: number = await this.reportsModel.add(report);

        return {
            httpStatus: this.SUCCESS_STATUS_CODE,
            reportId: reportId,
            success: true,
            message: this.SUCCESS_MESSAGE
        }
    }
}
