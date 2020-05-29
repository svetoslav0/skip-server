import { ReportEditDTO } from "../../data/reports/ReportEditDTO";

export class ReportsResponseFormatter {
    public formatGetReport(report: ReportEditDTO, entities: any[]) {
        return {
            name: report.name,
            userId: report.userId,
            reportEntities: this.formatEntities(entities)
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
