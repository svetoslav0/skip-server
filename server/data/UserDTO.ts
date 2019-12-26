import { IsEmail, MinLength, MaxLength } from "class-validator";
import { IsUsernameUnique } from "../controllers/validators/IsUsernameUnique";

export class UserDTO {
    private static readonly MIN_USERNAME_LENGTH: number = 6;
    private static readonly MAX_USERNAME_LENGTH: number = 64;

    private static readonly MIN_PASSWORD_LENGTH: number = 6;
    private static readonly MAX_PASSWORD_LENGTH: number = 128;

    private static readonly MIN_LENGTH_USERNAME_MESSAGE: string = `Username is too short. Must be at least ${UserDTO.MIN_USERNAME_LENGTH} characters long.`;
    private static readonly MAX_LENGTH_USERNAME_MESSAGE: string = `Username is too long. Must be not more than ${UserDTO.MAX_USERNAME_LENGTH} characters long.`;

    private static readonly MIN_LENGTH_PASSWORD_MESSAGE: string = `Password is too short. Must be at least ${UserDTO.MIN_PASSWORD_LENGTH} characters long.`;
    private static readonly MAX_LENGTH_PASSWORD_MESSAGE: string = `The password seems to be too long. Must be not more than ${UserDTO.MAX_PASSWORD_LENGTH} characters long.`;

    private static readonly INVALID_EMAIL_MESSAGE: string = "Email seems to be invalid";

    private static readonly USERNAME_EXISTS: string = "An user has already been registered with this username. Please choose another one.";

    private readonly _id!: number;

    @MinLength(UserDTO.MIN_USERNAME_LENGTH, {
        message: UserDTO.MIN_LENGTH_USERNAME_MESSAGE,
    })
    @MaxLength(UserDTO.MAX_USERNAME_LENGTH, {
        message: UserDTO.MAX_LENGTH_USERNAME_MESSAGE,
    })
    @IsUsernameUnique({
        message: UserDTO.USERNAME_EXISTS,
    })
    private readonly _username: string;

    @IsEmail({}, {
        message: UserDTO.INVALID_EMAIL_MESSAGE,
    })
    private readonly _email: string | undefined;

    @MinLength(UserDTO.MIN_PASSWORD_LENGTH, {
        message: UserDTO.MIN_LENGTH_PASSWORD_MESSAGE,
    })
    @MaxLength(UserDTO.MAX_PASSWORD_LENGTH, {
        message: UserDTO.MAX_LENGTH_PASSWORD_MESSAGE,
    })
    private readonly _password: string;

    private readonly _firstNameEn: string;

    private readonly _middleNameEn: string | undefined;

    private readonly _lastNameEn: string;

    private readonly _firstNameBg: string;

    private readonly _middleNameBg: string | undefined;

    private readonly _lastNameBg: string;

    constructor(reqBody: any) {
        // this._id = reqBody.id;
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
