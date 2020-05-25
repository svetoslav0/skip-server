import { IUsersResponseBuilder } from "./IUsersResponseBuilder";

export class UsersResponseBuilder {

    protected _userId!: number;
    protected _authToken!: string;
    protected _httpStatus!: number;
    protected _success!: boolean;
    protected _message!: string;
    protected _errors!: string[];

    public buildResponse(): IUsersResponseBuilder {
        return {
            data: {
                userId: this._userId,
                success: this._success,
                message: this._message,
                errors: this._errors
            }
        };
    }

    get authToken(): string {
        return this._authToken;
    }

    get httpStatus(): number {
        return this._httpStatus;
    }

    public setUserId(value: number): this {
        this._userId = value;
        return this;
    }

    public setAuthToken(value: string): this {
        this._authToken = value;
        return this;
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
}
