import {IUser} from "../controllers/IUser";

export class UserDTO{
    private _id: number;
    private _username: string;
    private _email: string | undefined;
    private _password: string;
    private _firstNameEn: string;
    private _middleNameEn: string | undefined;
    private _lastNameEn: string;
    private _firstNameBg: string;
    private _middleNameBg: string | undefined;
    private _lastNameBg: string;

    constructor (reqBody: IUser) {
        this._id = reqBody.id;
        this._username = reqBody.username;
        this._email = reqBody.email;
        this._password = reqBody.password;
        this._firstNameEn = reqBody.firstNameEn;
        this._middleNameEn = reqBody.middleNameEn;
        this._lastNameEn = reqBody.lastNameEn;
        this._firstNameBg = reqBody.firstNameBg;
        this._middleNameBg = reqBody.middleNameBg;
        this._lastNameBg = reqBody.lastNameBg;
    }


    get id(): number {
        return this._id;
    }

    get username(): string {
        return this._username;
    }

    get email(): string | undefined {
        return this._email;
    }

    get password(): string {
        return this._password;
    }

    get firstNameEn(): string {
        return this._firstNameEn;
    }

    get middleNameEn(): string | undefined {
        return this._middleNameEn;
    }

    get lastNameEn(): string {
        return this._lastNameEn;
    }

    get firstNameBg(): string {
        return this._firstNameBg;
    }

    get middleNameBg(): string | undefined {
        return this._middleNameBg;
    }

    get lastNameBg(): string {
        return this._lastNameBg;
    }
}
