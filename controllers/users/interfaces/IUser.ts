export interface IUser {
    id: number;
    username: string;
    email?: string;
    password: string;
    firstNameEn: string;
    middleNameEn?: string;
    lastNameEn: string;
    firstNameBg: string;
    middleNameBg?: string;
    lastNameBg: string;
}
