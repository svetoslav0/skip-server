export interface IClassRolesResponseBuilder {
    data: {
        classRoleId: number;
        success: boolean;
        message: string;
        errors: string[];
    }
}
