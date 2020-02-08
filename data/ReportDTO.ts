export class ReportDTO {

    private readonly _userId: number;

    private readonly _name: string;

    constructor(reqBody: any) {
        this._userId = reqBody.userId;
        this._name = reqBody.name;
    }

    get userId(): number {
        return this._userId;
    }

    get name(): string {
        return this._name;
    }
}
