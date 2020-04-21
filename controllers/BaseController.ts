import express from "express";
import httpStatus from "http-status-codes";

import { AbstractResponseBuilder } from "../data/AbstractResponseBuilder";
import { MESSAGES } from "../common/consts/MESSAGES";

export abstract class BaseController {
    protected _request!: express.Request;

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
            .setMessage(MESSAGES.ERRORS.COMMON.FAILED_UPDATING_RESOURCE)
            .setErrors([MESSAGES.ERRORS.AUTH.FORBIDDEN_RESOURCE_MESSAGE]);
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
            .setMessage(MESSAGES.ERRORS.COMMON.FAILED_UPDATING_RESOURCE)
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
            .setMessage(MESSAGES.ERRORS.COMMON.GENERAL_ERROR_MESSAGE)
            .setErrors([]);
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
            throw new Error(MESSAGES.ERRORS.COMMON.NON_NUMERIC_ID_PARAM_MESSAGE);
        }
    }
}
