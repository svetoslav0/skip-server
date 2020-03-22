import { AbstractResponseBuilder } from "../AbstractResponseBuilder";
import { IResponseBuilder } from "../IResponseBuilder";
import { IReportsResponseBuilder } from "./IReportsResponseBuilder";

export class ReportsResponseBuilder extends AbstractResponseBuilder implements IResponseBuilder {

    _httpStatus!: number;
    _reportId!: number;
    _success!: boolean;
    _message!: string;
    _errors!: string[];

    public buildResponse(): IReportsResponseBuilder {
        return this.buildData({
            reportId: this._reportId,
            success: this._success,
            message: this._message,
            errors: this._errors
        });
    }

    get httpStatus(): number {
        return this._httpStatus;
    }

    public setHttpStatus(httpStatus: number): this {
        this._httpStatus = httpStatus;
        return this;
    }

    public setReportId(reportId: number): this {
        this._reportId = reportId;
        return this;
    }

    public setSuccess(success: boolean): this {
        this._success = success;
        return this;
    }

    public setMessage(message: string): this {
        this._message = message;
        return this;
    }

    public setErrors(errors: string[]): this {
        this._errors = errors;
        return this;
    }

    public fillErrors(error: string): this {
        this._errors.push(error);
        return this;
    }
}
