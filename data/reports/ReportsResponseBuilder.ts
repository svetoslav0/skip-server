import { AbstractResponseBuilder } from "../AbstractResponseBuilder";
import { IResponseBuilder } from "../IResponseBuilder";
import { IReportsResponseBuilder } from "./IReportsResponseBuilder";

export class ReportsResponseBuilder extends AbstractResponseBuilder implements IResponseBuilder {

    _reportId!: number;

    public buildResponse(): IReportsResponseBuilder {
        return this.buildData({
            reportId: this._reportId
        });
    }

    public setReportId(reportId: number): this {
        this._reportId = reportId;
        return this;
    }
}
