import { AbstractResponseBuilder  } from "../AbstractResponseBuilder";
import { IReportEntitiesResponseBuilder } from "./IReportEntitiesResponseBuilder";

export class ReportEntitiesResponseBuilder extends AbstractResponseBuilder {

    _reportEntityId!: number;

    public buildResponse(): IReportEntitiesResponseBuilder {
        return this.buildData({
            reportEntityId: this._reportEntityId
        });
    }

    public setReportEntityId(id: number): this {
        this._reportEntityId = id;
        return this;
    }
}
