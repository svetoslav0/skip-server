import jwt from "jsonwebtoken";
import express from "express";

export class UsersMiddleware {

    private static readonly NO_TOKEN_MESSAGE: string = "Access denied. No token was provided.";
    private static readonly INVALID_TOKEN_MESSAGE: string = "Access denied. Provided token is invalid.";

    private static readonly BAD_REQUEST_STATUS_CODE: number = 400;
    private static readonly UNAUTHORIZED_STATUS_CODE: number = 401;

    public static auth(req: any, res: express.Response, next: express.NextFunction) {
        const token: string = req.header("auth-token") || "";

        if (! token) {
            return res
                .status(UsersMiddleware.UNAUTHORIZED_STATUS_CODE)
                .send(UsersMiddleware.buildResponse(UsersMiddleware.NO_TOKEN_MESSAGE));
        }

        try {
            req.user = jwt.verify(token, process.env.TOKEN_SECRET || "");
            return next();
        } catch (error) {
            return res
                .status(UsersMiddleware.BAD_REQUEST_STATUS_CODE)
                .send(UsersMiddleware.buildResponse(UsersMiddleware.INVALID_TOKEN_MESSAGE));
        }
    }

    private static buildResponse(message: string) {
        return {
            data: {
                error: "Authorization error",
                message: message
            }
        }
    }
}
