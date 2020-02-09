import {AbstractResponseBuilder} from "../AbstractResponseBuilder";

export class ReportResponseBuilder extends AbstractResponseBuilder{

    public buildCreateResponse(options: any) {
        return this.buildData({
            success: options.success,
            reportId: options.reportId,
            message: options.message,
            errors: options.errors
        });
    }

    public buildEditResponse(options: any) {
        return this.buildData({
            success: options.success,
            reportId: options.reportId || 0,
            message: options.message,
            errors: options.errors || []
        });
    }
}
