import express from "express";
import httpStatus from "http-status-codes";

import { AbstractResponseBuilder } from "../data/AbstractResponseBuilder";

export abstract class BaseController {

    protected readonly MAIN_ERROR_MESSAGE: string = "Something went wrong...";
    protected readonly BAD_ID_MESSAGE: string = "The given ID parameter is not numeric";

    protected _request!: express.Request;

    protected buildSuccessfullyCreatedMessage(controllerName: string): string {
        return `${controllerName} was successfully created!`;
    }

    protected buildSuccessfullyUpdatedMessage(controllerName: string): string {
        return `${controllerName} was successfully updated!`;
    }

    protected buildSuccessfullyArchivedMessage(controllerName: string): string {
        return `${controllerName} was successfully archived`;
    }

    protected buildFailedCreationMessage(controllerName: string): string {
        return `${controllerName} with the given parameters cannot be created!`;
    }

    protected buildFailedUpdatingMessage(controllerName: string): string {
        return `${controllerName} with the given parameters cannot be update!`;
    }

    protected buildFailedArchivingMessage(controllerName: string): string {
        return `${controllerName} with the given ID cannot be archived!`;
    }

    protected buildAccessDeniedErrorMessage(): string {
        return "Access denied. You do not have rights to make changes on this resource!";
    }

    /**
     * This methods builds response when status is FORBIDDEN
     *
     * @param {AbstractResponseBuilder} responseBuilder
     * @param {string}                  controllerName
     * @returns AbstractResponseBuilder
     */
    protected buildForbiddenResponse(
        responseBuilder: AbstractResponseBuilder, controllerName: string
    ): AbstractResponseBuilder {

        return responseBuilder
            .setHttpStatus(httpStatus.FORBIDDEN)
            .setSuccess(false)
            .setMessage(this.buildFailedUpdatingMessage(controllerName))
            .setErrors([this.buildAccessDeniedErrorMessage()]);
    }

    /**
     * This methods builds response when status is BAD_REQUEST
     *
     * @param {AbstractResponseBuilder} responseBuilder
     * @param {string}                  controllerName
     * @param {[string]}                errors
     * @returns {AbstractResponseBuilder}
     */
    protected buildBadRequestResponse(
        responseBuilder: AbstractResponseBuilder, controllerName: string, errors: string[]
    ): AbstractResponseBuilder {

        return responseBuilder
            .setHttpStatus(httpStatus.BAD_REQUEST)
            .setSuccess(false)
            .setMessage(this.buildFailedUpdatingMessage(controllerName))
            .setErrors(errors);
    }

    /**
     * This methods builds response when status is INTERNAL_SERVER_ERROR
     *
     * @param {AbstractResponseBuilder} responseBuilder
     * @param {string}                  controllerName
     * @returns {AbstractResponseBuilder}
     */
    protected buildInternalErrorResponse(
        responseBuilder: AbstractResponseBuilder, controllerName: string
    ): AbstractResponseBuilder {

        return responseBuilder
            .setHttpStatus(httpStatus.INTERNAL_SERVER_ERROR)
            .setSuccess(false)
            .setMessage(this.MAIN_ERROR_MESSAGE)
            .setErrors([this.buildFailedUpdatingMessage(controllerName)]);
    }

    /**
     * This methods handles errors from 'class-validation' pack methods
     *
     * @param validationError
     * @returns {[string]}
     */
    protected buildValidationErrors(validationError: any): string[] {
        return validationError
            .map((error: any) => error.constraints)
            .map((error: any) => Object.values(error))
            .flat();
    }

    /**
     * This method throws an exception if provided ID is not numeric
     *
     * @param id
     */
    protected validateIdParam(id: any): void {
        if(isNaN(id)) {
            throw new Error(this.BAD_ID_MESSAGE);
        }
    }
}
