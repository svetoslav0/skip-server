import {IUser} from "../controllers/IUser";
import {MysqlDatabase} from "../database/MysqlDatabase";

export class UsersModel {

    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    async add(user: IUser): Promise<boolean> {

        let res = await this.db.query(`
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
            user.lastNameBg
        ]);

        console.log(res);

        return false;
    }
}