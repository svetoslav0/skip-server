import { IDataResponseBuilder } from "./IDataResponseBuilder";

export class DataResponseBuilder {

    private status: number;
    private data: any;

    constructor(status: number, data: any, error: string = "") {
        this.status = status;
        this.data = data;
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
