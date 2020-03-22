import { AbstractResponseBuilder } from "../AbstractResponseBuilder";
import { IResponseBuilder } from "../IResponseBuilder";
import {IUsersResponseBuilder} from "./IUsersResponseBuilder";

export class UsersResponseBuilder extends AbstractResponseBuilder implements IResponseBuilder {
    
    _httpStatus!: number;
    _userId!: number;
    _success!: boolean;
    _message!: string;
    _errors!: string[];
    _authToken!: string;
    
    public buildResponse(): IUsersResponseBuilder {
        return this.buildData({
            userId: this._userId,
            success: this._success,
            message: this._message,
            errors: this._errors
        });
    }

    get httpStatus(): number {
        return this._httpStatus;
    }

    get authToken(): string {
        return this._authToken;
    }

    public setHttpStatus(value: number): this{
        this._httpStatus = value;
        return this;
    }

    public setSuccess(value: boolean): this{
        this._success = value;
        return this;
    }

    public setUserId(value: number): this{
        this._userId = value;
        return this;
    }

    public setMessage(value: string): this{
        this._message = value;
        return this;
    }

    public setErrors(value: string[]): this{
        this._errors = value;
        return this;
    }

    public setAuthToken(value: string): this{
        this._authToken = value;
        return this;
    }
}
