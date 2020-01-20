import { IsEmail, MinLength, MaxLength, IsDefined } from "class-validator";
import { IsUsernameUnique } from "../controllers/users/validators/IsUsernameUnique";
import { IsEmailUnique } from "../controllers/users/validators/IsEmailUnique";

export class UserDTO {
    private static readonly MIN_USERNAME_LENGTH: number = 6;
    private static readonly MAX_USERNAME_LENGTH: number = 64;

    private static readonly MIN_PASSWORD_LENGTH: number = 6;
    private static readonly MAX_PASSWORD_LENGTH: number = 128;

    private static readonly MIN_LENGTH_USERNAME_MESSAGE: string = `Username is too short. Must be at least ${UserDTO.MIN_USERNAME_LENGTH} characters long.`;
    private static readonly MAX_LENGTH_USERNAME_MESSAGE: string = `Username is too long. Must be not more than ${UserDTO.MAX_USERNAME_LENGTH} characters long.`;

    private static readonly MIN_LENGTH_PASSWORD_MESSAGE: string = `Password is too short. Must be at least ${UserDTO.MIN_PASSWORD_LENGTH} characters long.`;
    private static readonly MAX_LENGTH_PASSWORD_MESSAGE: string = `The password seems to be too long. Must be not more than ${UserDTO.MAX_PASSWORD_LENGTH} characters long.`;

    private static readonly INVALID_EMAIL_MESSAGE: string = "Email seems to be invalid.";

    private static readonly USERNAME_EXISTS: string = "An user has already been registered with this username. Please choose another one.";
    private static readonly EMAIL_EXISTS: string = "An user has already been registered with this email. Please choose another one.";

    private readonly _id!: number;

    @IsDefined()
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
    @IsEmailUnique({
        message: UserDTO.EMAIL_EXISTS,
    })
    private readonly _email: string | undefined;

    @MinLength(UserDTO.MIN_PASSWORD_LENGTH, {
        message: UserDTO.MIN_LENGTH_PASSWORD_MESSAGE,
    })
    @MaxLength(UserDTO.MAX_PASSWORD_LENGTH, {
        message: UserDTO.MAX_LENGTH_PASSWORD_MESSAGE,
    })
    private _password: string;

    private readonly _firstName: string;

    private readonly _middleName: string | undefined;

    private readonly _lastName: string;

    constructor(reqBody: any) {
        this._username = reqBody.username;
        this._email = reqBody.email;
        this._password = reqBody.password;
        this._firstName = reqBody.firstName;
        this._middleName = reqBody.middleName;
        this._lastName = reqBody.lastName;
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
}
