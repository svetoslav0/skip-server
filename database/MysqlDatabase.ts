import mysql from "mysql";

export class MysqlDatabase {

    private db: mysql.Pool;

    constructor() {
        this.db = this.config();
    }

    public async query(queryString: string, params: any[] = []): Promise<any> {
        return new Promise(async (resolve, reject) => {
            await this.db.query(queryString, params, (err: mysql.MysqlError | null, rows: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }

                resolve(rows);
            });
        });
    }

    public closeConnection() {
        this.db.end();
    }

    private config(): mysql.Pool {
        const connection = this.mysqlDatabaseFactory();
        console.log("Creating database connection . . .");

        return mysql.createPool(connection);
    }

    private mysqlDatabaseFactory() {
        // Dev environment
        const defaultConnection = {
            database: process.env.DB_DATABASE || "",
            host: process.env.DB_HOST || "",
            password: process.env.DB_PASS || "",
            user: process.env.DB_USER || "",
        };

        let connection: { database: string; password: string; host: string; user: string };
        switch (process.env.ENVIRONMENT) {
            case "dev":
                connection = defaultConnection;
                break;
            case "test":
                connection = {
                    database: process.env.TEST_DB_DATABASE || "",
                    host: process.env.TEST_DB_HOST || "",
                    password: process.env.TEST_DB_PASS || "",
                    user: process.env.TEST_DB_USER || "",
                };
                break;
            case "remote-test":
                connection = {
                    database: process.env.REMOTE_TEST_DB_DATABASE || "",
                    host: process.env.REMOTE_TEST_DB_HOST || "",
                    password: process.env.REMOTE_TEST_DB_PASS || "",
                    user: process.env.REMOTE_TEST_DB_USER || "",
                };
                break;
            default:
                connection = defaultConnection;
                break;
        }

        return connection;
    }
}
