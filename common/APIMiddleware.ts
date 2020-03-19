import jwt from "jsonwebtoken";
import express from "express";
import {IAuthResponse} from "./interfaces/IAuthResponse";

export class APIMiddleware {

    private static readonly AUTHORIZATION_ERROR_MESSAGE: string = "Authorization error";
    private static readonly NO_TOKEN_MESSAGE: string = "Access denied. No token was provided.";
    private static readonly INVALID_TOKEN_MESSAGE: string = "Access denied. Provided token is invalid.";
    private static readonly FORBIDDEN_RESOURCE_MESSAGE: string = "Access denied. You do not have rights to do this!";

    private static readonly EMPLOYEE_ROLE_ID: number = 1;
    private static readonly ADMIN_ROLE_ID: number = 2;

    private static readonly BAD_REQUEST_STATUS_CODE: number = 400;
    private static readonly UNAUTHORIZED_STATUS_CODE: number = 401;
    private static readonly FORBIDDEN_STATUS_CODE: number = 403;

    public static authorize(req: express.Request, res: express.Response, next: express.NextFunction): IAuthResponse {
        const token: string = req.header("auth-token") || "";

        if (! token) {
            return {
                isAuthorized: false,
                status: APIMiddleware.UNAUTHORIZED_STATUS_CODE,
                response: APIMiddleware.buildResponse(APIMiddleware.NO_TOKEN_MESSAGE)
            };
        }

        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET || "");

            // @ts-ignore
            const {userId, roleId} = verified;
            req.userId = userId;
            req.roleId = roleId;

            return {
                isAuthorized: true
            };
        } catch (error) {
            return {
                isAuthorized: false,
                status: APIMiddleware.BAD_REQUEST_STATUS_CODE,
                response: APIMiddleware.buildResponse(APIMiddleware.INVALID_TOKEN_MESSAGE)
            };
        }
    }

    public static isUserEmployee(req: express.Request, res: express.Response, next: express.NextFunction) {
        const auth: IAuthResponse = APIMiddleware.authorize(req, res, next);
        if (!auth.isAuthorized) {
            return res.status(auth.status || APIMiddleware.UNAUTHORIZED_STATUS_CODE)
                .send(auth.response);
        }

        if (req.roleId >= APIMiddleware.EMPLOYEE_ROLE_ID) {
            return next();
        }

        return res
            .status(APIMiddleware.FORBIDDEN_STATUS_CODE)
            .send(APIMiddleware.buildResponse(APIMiddleware.FORBIDDEN_RESOURCE_MESSAGE));
    }

    public static isUserAdministrator(req: express.Request, res: express.Response, next: express.NextFunction) {
        const auth: IAuthResponse = APIMiddleware.authorize(req, res, next);
        if (!auth.isAuthorized) {
            return res.status(auth.status || APIMiddleware.UNAUTHORIZED_STATUS_CODE)
                .send(auth.response);
        }

        if (req.roleId === APIMiddleware.ADMIN_ROLE_ID) {
            return next();
        }

        return res
            .status(APIMiddleware.FORBIDDEN_STATUS_CODE)
            .send(APIMiddleware.buildResponse(APIMiddleware.FORBIDDEN_RESOURCE_MESSAGE));
    }

    private static buildResponse(message: string) {
        return {
            data: {
                error: APIMiddleware.AUTHORIZATION_ERROR_MESSAGE,
                message
            }
        };
    }
}
