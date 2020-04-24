import { MysqlDatabase } from "../database/MysqlDatabase";
import { ReportEntityDTO } from "../data/reportEntities/ReportEntityDTO";

export class ReportEntitiesModel {
    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    /**
     * Inserts a report entity
     *
     * @param {ReportEntityDTO} reportEntity
     * @returns {Promise<number>}
     */
    public async add(reportEntity: ReportEntityDTO): Promise<number> {
        const result: any = this.db.query(`
            INSERT INTO
                report_entities (
                    report_id,
                    date,
                    class_id,
                    class_role_id,
                    hours_spend
                )
            VALUE (?, ?, ?, ?, ?);
        `, [
            reportEntity.reportId,
            reportEntity.date,
            reportEntity.classId,
            reportEntity.classRoleId,
            reportEntity.hoursSpend
        ]);

        return result.insertId;
    }
}
