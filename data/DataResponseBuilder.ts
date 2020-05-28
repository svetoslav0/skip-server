import { IDataResponseBuilder } from "./IDataResponseBuilder";

export class DataResponseBuilder {

    private status: number;
    private data: any;

    constructor(status: number, data: any, error: string = "") {
        this.status = status;
        this.data = data;
    }

    public buildData(): IDataResponseBuilder {
        return {
            httpStatus: this.status,
            data: this.data
        };
    }

    public buildResponse() {
        return {
            data: this.data
        };
    }

    public getStatus(): number {
        return this.status;
    }
}
