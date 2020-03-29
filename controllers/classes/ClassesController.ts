import express from "express";
import { ClassesModel } from "../../models/ClassesModel";
import { ClassesDTO } from "../../data/classes/ClassesDTO";
import { ClassesEditDTO } from "../../data/classes/ClassesEditDTO";
import { ClassesResponseBuilder } from "../../data/classes/ClassesResponseBuilder";
import { validateOrReject } from "class-validator";
import { BaseController } from "../BaseController";

export class ClassesController extends BaseController {

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
            const errors: string[] = this.buildValidationErrors(validationError);

            return responseBuilder
                .setHttpStatus(this.STATUS_CODE_BAD_REQUEST)
                .setSuccess(false)
                .setMessage(this.buildFailedCreationMessage(this.CONTROLLER_NAME))
                .setErrors(errors)
        }
    }

    public async edit(request: express.Request): Promise<ClassesResponseBuilder> {
        const responseBuilder: ClassesResponseBuilder = new ClassesResponseBuilder();

        const classId: number = +request.params.id;

        let currentClass: ClassesEditDTO | null = await this.classesModel.findById(classId);

        if (!currentClass || !currentClass.id || currentClass.id !== classId) {
            currentClass = new ClassesEditDTO(classId, {});
        }

        let errors: string[] = [];

        try {
            currentClass
                .setId(classId)
                .setName(request.body.name || currentClass.name)
                .setAgeGroup(request.body.ageGroup || currentClass.ageGroup);

            await validateOrReject(currentClass);
        } catch (validationError) {
            errors = this.buildValidationErrors(validationError);

            return responseBuilder
                .setHttpStatus(this.STATUS_CODE_BAD_REQUEST)
                .setSuccess(false)
                .setMessage(this.buildFailedUpdatingMessage(this.CONTROLLER_NAME))
                .setErrors(errors);
        }

        const isUpdated: boolean = await this.classesModel.update(currentClass);

        if (isUpdated) {
            return responseBuilder
                .setHttpStatus(this.STATUS_CODE_OK)
                .setClassId(classId)
                .setSuccess(true)
                .setMessage(this.buildSuccessfullyUpdatedMessage(this.CONTROLLER_NAME))
        }

        return responseBuilder
            .setHttpStatus(this.STATUS_CODE_INTERNAL_SERVER_ERROR)
            .setSuccess(false)
            .setMessage(this.MAIN_ERROR_MESSAGE)
            .setErrors([
                ...errors,
                this.buildFailedUpdatingMessage(this.CONTROLLER_NAME)
            ]);
    }
}
