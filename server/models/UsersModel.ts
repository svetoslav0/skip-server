import {MysqlDatabase} from "../database/MysqlDatabase";
import {UserDTO} from "../data/UserDTO";

export class UsersModel {

    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    /**
     * Inserts a user in the database and returns result that tells if it was successful
     * @param user
     */
    public async add(user: UserDTO): Promise<boolean> {
        const result: any = await this.db.query(`
                INSERT INTO
                    users (
                        username,
                        email,
                        password,
                        first_name_en,
                        middle_name_en,
                        last_name_en,
                        first_name_bg,
                        middle_name_bg,
                        last_name_bg
                    )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            user.username,
            user.email,
            user.password,
            user.firstNameEn,
            user.middleNameEn,
            user.lastNameEn,
            user.firstNameBg,
            user.middleNameBg,
            user.lastNameBg,
        ]);

        return result.affectedRows === 1;
    }

    /**
     * Returns "true" or "false" depending on whether username is unique or not
     * @param username
     */
    public async isUsernameUnique(username: string): Promise<boolean> {
        const result: any = await this.db.query(`
                SELECT
                    id
                FROM
                    users
                WHERE
                    username = ?
        `, [username]);

        return result.length === 0;
    }
}
