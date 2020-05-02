import { IsEmail, IsDefined, Validate } from "class-validator";
import { IsUsernameUnique } from "../validators/IsUsernameUnique";
import { IsEmailUnique } from "../validators/IsEmailUnique";
import { MinimumLength } from "../validators/MinimumLength";
import { MaximumLength } from "../validators/MaximumLength";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { CONSTRAINTS } from "../../common/consts/CONSTRAINTS";
import { DEFAULT_ROLE } from "../../common/consts/ROLES";

export class UserDTO {

    @IsDefined({
        message: MESSAGES.ERRORS.USERS.USERNAME_FIELD_NOT_DEFINED_MESSAGE
    })
    @Validate(MinimumLength, [CONSTRAINTS.USERS.MIN_USERNAME_LENGTH], {
        message: MESSAGES.ERRORS.USERS.USERNAME_FIELD_TOO_SHORT_MESSAGE
    })
    @Validate(MaximumLength, [CONSTRAINTS.USERS.MAX_USERNAME_LENGTH], {
        message: MESSAGES.ERRORS.USERS.USERNAME_FIELD_TOO_LONG_MESSAGE
    })
    @IsUsernameUnique({
        message: MESSAGES.ERRORS.USERS.USERNAME_EXISTS_MESSAGE,
    })
    private readonly _username: string;

    private readonly _id!: number;

    @IsDefined({
        message: MESSAGES.ERRORS.USERS.EMAIL_FIELD_NOT_DEFINED_MESSAGE
    })
    @IsEmail({}, {
        message: MESSAGES.ERRORS.USERS.EMAIL_FIELD_IS_INVALID_MESSAGE,
    })
    @IsEmailUnique({
        message: MESSAGES.ERRORS.USERS.EMAIL_EXISTS_MESSAGE,
    })
    private readonly _email: string | undefined;

    @IsDefined({
        message: MESSAGES.ERRORS.USERS.PASSWORD_FIELD_NOT_DEFINED_MESSAGE
    })
    @Validate(MinimumLength, [CONSTRAINTS.USERS.MIN_PASSWORD_LENGTH], {
        message: MESSAGES.ERRORS.USERS.PASSWORD_FIELD_TOO_SHORT_MESSAGE
    })
    @Validate(MaximumLength, [CONSTRAINTS.USERS.MAX_PASSWORD_LENGTH], {
        message: MESSAGES.ERRORS.USERS.PASSWORD_FIELD_TOO_LONG_MESSAGE
    })
    private _password: string;

    @IsDefined({
        message: MESSAGES.ERRORS.USERS.FIRST_NAME_FIELD_NOT_DEFINED_MESSAGE
    })
    private readonly _firstName: string;

    private readonly _middleName: string | undefined;

    @IsDefined({
        message: MESSAGES.ERRORS.USERS.LAST_NAME_FIELD_NOT_DEFINED_MESSAGE
    })
    private readonly _lastName: string;

    private readonly _roleId: number;

    constructor(reqBody: any) {
        this._username = reqBody.username;
        this._email = reqBody.email;
        this._password = reqBody.password;
        this._firstName = reqBody.firstName;
        this._middleName = reqBody.middleName;
        this._lastName = reqBody.lastName;
        this._roleId = +reqBody.roleId || DEFAULT_ROLE;
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

    set password(password: string) {
        this._password = password;
    }

    get firstName(): string {
        return this._firstName;
    }

    get middleName(): string | undefined {
        return this._middleName;
    }

    get lastName(): string {
        return this._lastName;
    }

    get roleId(): number {
        return this._roleId;
    }
}
