import { ReportEditDTO } from "../../data/reports/ReportEditDTO";

export class ReportsResponseFormatter {
    public formatGetReport(report: ReportEditDTO, entities: any[]) {
        return {
            name: report.name,
            userId: report.userId,
            description: report.description,
            reportEntities: this.formatEntities(entities)
        };
    }

    public formatGetReportsForUserId(reportsCount: number, reports: any) {
        return {
            count: reportsCount,
            reports
        };
    }

    private formatEntities(entities: any[]) {
        return entities.map((entity: any) => {
            return {
                id: entity.reportEntityId,
                date: entity.date,
                className: entity.className,
                classRoleName: entity.classRoleName,
                hoursSpend: entity.hoursSpend,
                description: entity.description
            };
        });
    }
}
