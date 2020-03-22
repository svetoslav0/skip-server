export interface IUsersResponseBuilder {
    data: {
        userId: number;
        success: boolean;
        message: string;
        errors: string[];
    }
}
