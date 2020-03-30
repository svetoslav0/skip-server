import { IResponseBuilder } from "./IResponseBuilder";

export abstract class AbstractResponseBuilder implements IResponseBuilder {

    protected _httpStatus!: number;
    protected _success!: boolean;
    protected _message!: string;
    protected _errors!: string[];

    get httpStatus(): number {
        return this._httpStatus;
    }

    public setHttpStatus(httpStatus: number): this {
        this._httpStatus = httpStatus;
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

    protected buildData(data: any) {
        return {
            data: {
                ...data,
                success: this._success,
                message: this._message,
                errors: this._errors
            }
        };
    }

    public buildResponse() {
        return this.buildData({});
    }
}
