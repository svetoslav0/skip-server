import {MysqlDatabase} from "../database/MysqlDatabase";
import {ReportDTO} from "../data/ReportDTO";

export class ReportsModel {
    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    public async add(report: ReportDTO): Promise<number> {
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

    public async findById(reportId: number): Promise<any> {
        const result: any = await this.db.query(`
                SELECT
                    id,
                    user_id as userId,
                    name
                FROM
                    reports
                WHERE
                    id = ?
        `, [reportId]);

        return new ReportDTO(result[0]);
    }

    public async getTableFields(): Promise<string[]> {
        const result = await this.db.query(`
                SELECT
                    COLUMN_NAME
                FROM
                    INFORMATION_SCHEMA.COLUMNS
                WHERE
                    TABLE_SCHEMA = ?
                AND
                    TABLE_NAME = ?
        `, [process.env.DB_DATABASE, 'reports']);

        return result
                .map((obj: any) => Object.values(obj))
                .flat();
    }

    public async update(report: ReportDTO): Promise<boolean> {
        const result = await this.db.query(`
            UPDATE
                reports
            SET
                name = ?
            WHERE
                id = ?
        `, [report.name, report.id]);

        return result.affectedRows == 1;
    }
}
