import express from "express";
import { ClassesModel } from "../../models/ClassesModel";
import { ClassesDTO } from "../../data/classes/ClassesDTO";
import { ClassesEditDTO } from "../../data/classes/ClassesEditDTO";
import { ClassesResponseBuilder } from "../../data/classes/ClassesResponseBuilder";
import { validateOrReject } from "class-validator";

export class ClassesController {

    private readonly SUCCESS_STATUS_CODE: number = 200;
    private readonly BAD_REQUEST_STATUS_CODE: number = 400;

    private readonly SUCCESS_MESSAGE: string = "Class was successfully created!";
    private readonly UNSUCCESSFUL_CREATION: string = "Class with given parameters cannot be created!";

    private classesModel: ClassesModel;

    constructor(classesModel: ClassesModel) {
        this.classesModel = classesModel;
    }

    public async create(request: express.Request): Promise<ClassesResponseBuilder> {
        const responseBuilder: ClassesResponseBuilder = new ClassesResponseBuilder();

        try {
            const currentClass: ClassesDTO = new ClassesDTO(request.body);

            await validateOrReject(currentClass);

            const classId: number = await this.classesModel.add(currentClass);

            return responseBuilder
                .setHttpStatus(this.SUCCESS_STATUS_CODE)
                .setClassId(classId)
                .setSuccess(true)
                .setMessage(this.SUCCESS_MESSAGE);

        } catch (validationError) {
            const errors: string[] = validationError
                .map((error: any) => error.constraints)
                .map((error: any) => Object.values(error))
                .flat();

            return responseBuilder
                .setHttpStatus(this.BAD_REQUEST_STATUS_CODE)
                .setSuccess(false)
                .setMessage(this.UNSUCCESSFUL_CREATION)
                .setErrors(errors)
        }
    }
}
