import { AbstractResponseBuilder } from "../AbstractResponseBuilder";
import { IResponseBuilder } from "../IResponseBuilder";
import { IClassesResponseBuilder } from "./IClassesResponseBuilder";

export class ClassesResponseBuilder extends AbstractResponseBuilder implements IResponseBuilder{

    _httpStatus!: number;
    _classId!: number;
    _success!: boolean;
    _message!: string;
    _errors!: string[];

    public buildResponse(): IClassesResponseBuilder {
        return this.buildData({
            classId: this._classId,
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

    public setClassId(id: number): this {
        this._classId = id;
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
