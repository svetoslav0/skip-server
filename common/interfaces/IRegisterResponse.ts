export interface IRegisterResponse {
    httpStatus: number;
    userId?: number,
    success: boolean;
    message: string;
    errors?: string[];
}
