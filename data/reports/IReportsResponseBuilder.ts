export interface IReportsResponseBuilder {
    data: {
        reportId: number;
        success: boolean;
        message: string;
        errors: string[];
    }
}
