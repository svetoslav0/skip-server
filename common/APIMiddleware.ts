import jwt from "jsonwebtoken";
import express from "express";
import httpStatus from "http-status-codes";

import { ROLES } from "./ROLES";
import { IAuthResult } from "./IAuthResult";

export class APIMiddleware {

    private static readonly AUTHORIZATION_ERROR_MESSAGE: string = "Authorization error";
    private static readonly NO_TOKEN_MESSAGE: string = "Access denied. No token was provided.";
    private static readonly INVALID_TOKEN_MESSAGE: string = "Access denied. Provided token is invalid.";
    private static readonly FORBIDDEN_RESOURCE_MESSAGE: string = "Access denied. You do not have rights to do this action!";

    public static authorize(req: express.Request, res: express.Response, next: express.NextFunction): IAuthResult {
        const token: string = req.header("auth-token") || "";

        if (!token) {
            return {
                isAuthorized: false,
                status: httpStatus.UNAUTHORIZED,
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
                status: httpStatus.UNAUTHORIZED,
                response: APIMiddleware.buildResponse(APIMiddleware.INVALID_TOKEN_MESSAGE)
            };
        }
    }

    public static isUserEmployee(req: express.Request, res: express.Response, next: express.NextFunction) {
        const auth: IAuthResult = APIMiddleware.authorize(req, res, next);
        if (!auth.isAuthorized) {
            return res.status(auth.status || httpStatus.UNAUTHORIZED)
                .send(auth.response);
        }

        if (req.roleId >= ROLES.EMPLOYEE) {
            return next();
        }

        return res
            .status(httpStatus.FORBIDDEN)
            .send(APIMiddleware.buildResponse(APIMiddleware.FORBIDDEN_RESOURCE_MESSAGE));
    }

    public static isUserAdministrator(req: express.Request, res: express.Response, next: express.NextFunction) {
        const auth: IAuthResult = APIMiddleware.authorize(req, res, next);
        if (!auth.isAuthorized) {
            return res.status(auth.status || httpStatus.UNAUTHORIZED)
                .send(auth.response);
        }

        if (req.roleId === ROLES.ADMIN) {
            return next();
        }

        return res
            .status(httpStatus.FORBIDDEN)
            .send(APIMiddleware.buildResponse(APIMiddleware.FORBIDDEN_RESOURCE_MESSAGE));
    }

    public static async isUserOwner(getResourceUserIdByResourceId: (id: number) => Promise<number>) {
        return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (req.roleId === ROLES.ADMIN) {
                return next();
            }

            const resourceId = +req.params.id;
            const userId = await getResourceUserIdByResourceId(resourceId);

            if (userId === req.userId) {
                return next();
            }

            return res
                .status(httpStatus.FORBIDDEN)
                .send(APIMiddleware.buildResponse(APIMiddleware.FORBIDDEN_RESOURCE_MESSAGE));
        };
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
