export class ResponseBuilder {
    protected _httpStatus!: number;
    protected _resourceId!: number;
    protected _success!: boolean;
    protected _message!: string;
    protected _errors!: string[];

    public buildResponse() {
        return {
            data: {
                resourceId: this._resourceId,
                success: this._success,
                message: this._message,
                errors: this._errors
            }
        };
    }

    get httpStatus(): number {
        return this._httpStatus;
    }

    public setHttpStatus(httpStatus: number): this {
        this._httpStatus = httpStatus;
        return this;
    }

    public setResourceId(id: number): this {
        this._resourceId = id;
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
}
