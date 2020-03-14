import {MysqlDatabase} from "../database/MysqlDatabase";
import {UserDTO} from "../data/users/UserDTO";

export class UsersModel {

    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    /**
     * Inserts an user in the database and returns the ID of the created user
     * @param user
     */
    public async add(user: UserDTO): Promise<number> {
        const result: any = await this.db.query(`
                INSERT INTO
                    users (
                        username,
                        email,
                        password,
                        first_name,
                        middle_name,
                        last_name,
                        role_id
                    )
                VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            user.username,
            user.email,
            user.password,
            user.firstName,
            user.middleName,
            user.lastName,
            user.roleId
        ]);

        return result.insertId;
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

    /**
     * Returns "true" or "false" depending on whether username is unique or not
     * @param {string} email
     * @return Promise<boolean>
     */
    public async isEmailUnique(email: string): Promise<boolean> {
        const result: any = await this.db.query(`
                SELECT
                    id
                FROM
                    users
                WHERE
                    email = ?
        `, [email]);

        return result.length === 0;
    }

    /**
     * Finds user by given ID and returns UserDTO
     * @param {number} id
     * @return Promise<UserDTO>
     */
    public async findById(id: number): Promise<UserDTO> {
        const result: any = await this.db.query(`
                SELECT
                    id,
                    username,
                    role_id AS roleId
                FROM
                    users
                WHERE
                    id = ?
        `, [id]);

        return result[0];
    }

    public async findByUsername(username: string): Promise<UserDTO> {
        const result: any = await this.db.query(`
                SELECT
                    id,
                    username,
                    password,
                    role_id AS roleId
                FROM
                    users
                WHERE
                    username = ?
        `, [username]);

        return result[0];
    }

    public async findRoleIdByUserId(userId: number): Promise<number> {
        const result: any = await this.db.query(`
            SELECT
                roleId
            FROM
                users
            WHERE
                id = ?
        `, [userId]);

        return result[0];
    }

    // Used for testing purposes
    public async removeById(userId: number): Promise<void> {
        await this.db.query(`
            DELETE FROM
                users
            WHERE
                id = ?
        `, [userId]);
    }
}
