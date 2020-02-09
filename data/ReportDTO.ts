export class ReportDTO {

    private _id!: number;
    private readonly _userId: number;
    private _name: string;

    constructor(body: any) {
        this._userId = body.userId;
        this._name = body.name;
    }

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

    get userId(): number {
        return this._userId;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }
}
