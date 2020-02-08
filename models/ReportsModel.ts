import {MysqlDatabase} from "../database/MysqlDatabase";
import {ReportDTO} from "../data/ReportDTO";

export class ReportsModel {
    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    async add(report: ReportDTO): Promise<number> {
        const result: any = await this.db.query(`
                INSERT INTO
                    reports (
                        user_id,
                        name
                    )
                VALUES (?, ?)
        `, [
            report.userId,
            report.name
        ]);

        return result.insertId;
    }
}
