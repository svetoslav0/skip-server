import mysql from "mysql";

export class MysqlDatabase {

    private db: mysql.Connection;

    constructor() {
        this.db = this.config();
    }

    public async query(queryString: string, params: any[] = []): Promise<any> {
        await this.config().connect();

        return new Promise(async (resolve, reject) => {
                await this.db.query(queryString, params, (err: mysql.MysqlError | null, rows: any) => {
                if (err) {
                    throw err;
                }

                resolve(rows);
            });
        });
    }

    public closeConnection() {
        this.db.end();
    }

    private config(): mysql.Connection {
        return mysql.createConnection({
            database: process.env.DB_DATABASE,
            host: process.env.DB_HOST,
            password: process.env.DB_PASS,
            user: process.env.DB_USER,
        });
    }
}
