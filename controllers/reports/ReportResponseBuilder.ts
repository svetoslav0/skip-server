import {AbstractResponseBuilder} from "../AbstractResponseBuilder";

export class ReportResponseBuilder extends AbstractResponseBuilder{

    public buildCreateResponse(options: any) {
        return this.buildData({
           success: options.success,
           message: options.message,
           errors: options.errors
        });
    }
}
