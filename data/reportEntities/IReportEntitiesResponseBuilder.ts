export interface IReportEntitiesResponseBuilder {
    data: {
        reportEntityId: number;
        success: boolean;
        message: string;
        errors: string[];
    }
}
