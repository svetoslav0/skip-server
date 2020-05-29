import express from "express";
import httpStatus from "http-status-codes";
import { MESSAGES } from "./consts/MESSAGES";

export const handleError = (err: any, res: express.Response) => {
    console.error(err);

    res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({
            status: "error",
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: MESSAGES.ERRORS.COMMON.GENERAL_ERROR_MESSAGE
        }
    );
};
