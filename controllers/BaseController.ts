import express from "express";
import httpStatus from "http-status-codes";

import { MESSAGES } from "../common/consts/MESSAGES";
import { ManipulationsResponseBuilder } from "../data/ManipulationsResponseBuilder";
import { ROLES } from "../common/consts/ROLES";

export abstract class BaseController {
    protected _request!: express.Request;

    /**
     * This methods builds response when status is FORBIDDEN
     *
     * @param {ManipulationsResponseBuilder} responseBuilder
     * @returns ManipulationsResponseBuilder
     */
    protected buildForbiddenResponse(responseBuilder: ManipulationsResponseBuilder): ManipulationsResponseBuilder {

        return responseBuilder
            .setHttpStatus(httpStatus.FORBIDDEN)
            .setSuccess(false)
            .setMessage(MESSAGES.ERRORS.COMMON.FAILED_UPDATING_RESOURCE_MESSAGE)
            .setErrors([MESSAGES.ERRORS.AUTH.FORBIDDEN_RESOURCE_MESSAGE]);
    }

    /**
     * This methods builds response when status is BAD_REQUEST
     *
     * @param {ManipulationsResponseBuilder} responseBuilder
     * @param {[string]}        errors
     * @returns {ManipulationsResponseBuilder}
     */
    protected buildBadRequestResponse(
        responseBuilder: ManipulationsResponseBuilder, errors: string[]
    ): ManipulationsResponseBuilder {

        return responseBuilder
            .setHttpStatus(httpStatus.BAD_REQUEST)
            .setSuccess(false)
            .setMessage(MESSAGES.ERRORS.COMMON.FAILED_UPDATING_RESOURCE_MESSAGE)
            .setErrors(errors);
    }

    /**
     * This methods builds response when status is INTERNAL_SERVER_ERROR
     *
     * @param {ManipulationsResponseBuilder} responseBuilder
     * @returns {ManipulationsResponseBuilder}
     */
    protected buildInternalErrorResponse(responseBuilder: ManipulationsResponseBuilder): ManipulationsResponseBuilder {

        return responseBuilder
            .setHttpStatus(httpStatus.INTERNAL_SERVER_ERROR)
            .setSuccess(false)
            .setMessage(MESSAGES.ERRORS.COMMON.GENERAL_ERROR_MESSAGE);
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
     * This methods checks if the logged user has access
     *  to edit or delete this resource.
     *  NOTE: Admins can edit and delete every report
     *
     * @returns {Promise<boolean>}
     * @param {number} ownerId
     */
    protected async hasUserAccess(ownerId: number): Promise<boolean> {
        if (this._request.roleId === ROLES.ADMIN) {
            return true;
        }

        return ownerId === this._request.userId;
    }

    /**
     * This method throws an exception if provided ID is not numeric
     *
     * @param id
     */
    protected validateIdParam(id: any): void {
        if (isNaN(id)) {
            throw new Error(MESSAGES.ERRORS.COMMON.NON_NUMERIC_ID_PARAM_MESSAGE);
        }
    }

    /**
     * @param date
     */
    protected isValidDate(date: any) {
        return !isNaN(date) && date instanceof Date;
    }
}
