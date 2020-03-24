import express from "express";
import { ClassesModel } from "../../models/ClassesModel";
import { ClassesDTO } from "../../data/classes/ClassesDTO";
import { ClassesEditDTO } from "../../data/classes/ClassesEditDTO";
import { ClassesResponseBuilder } from "../../data/classes/ClassesResponseBuilder";
import { validateOrReject } from "class-validator";
import { BaseController } from "../BaseController";

export class ClassesController extends BaseController{

    private readonly CONTROLLER_NAME: string = "Class";

    private classesModel: ClassesModel;

    constructor(classesModel: ClassesModel) {
        super();
        this.classesModel = classesModel;
    }

    public async create(request: express.Request): Promise<ClassesResponseBuilder> {
        const responseBuilder: ClassesResponseBuilder = new ClassesResponseBuilder();

        try {
            const currentClass: ClassesDTO = new ClassesDTO(request.body);

            await validateOrReject(currentClass);

            const classId: number = await this.classesModel.add(currentClass);

            return responseBuilder
                .setHttpStatus(this.STATUS_CODE_CREATED)
                .setClassId(classId)
                .setSuccess(true)
                .setMessage(this.buildSuccessfullyCreatedMessage(this.CONTROLLER_NAME));

        } catch (validationError) {
            const errors: string[] = validationError
                .map((error: any) => error.constraints)
                .map((error: any) => Object.values(error))
                .flat();

            return responseBuilder
                .setHttpStatus(this.STATUS_CODE_BAD_REQUEST)
                .setSuccess(false)
                .setMessage(this.buildFailedCreationMessage(this.CONTROLLER_NAME))
                .setErrors(errors)
        }
    }
}
