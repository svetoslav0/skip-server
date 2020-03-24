import { AbstractResponseBuilder } from "../AbstractResponseBuilder";
import { IResponseBuilder } from "../IResponseBuilder";
import {IUsersResponseBuilder} from "./IUsersResponseBuilder";

export class UsersResponseBuilder extends AbstractResponseBuilder implements IResponseBuilder {

    _userId!: number;
    _authToken!: string;
    
    public buildResponse(): IUsersResponseBuilder {
        return this.buildData({
            userId: this._userId
        });
    }

    get authToken(): string {
        return this._authToken;
    }

    public setUserId(value: number): this{
        this._userId = value;
        return this;
    }

    public setAuthToken(value: string): this{
        this._authToken = value;
        return this;
    }
}
