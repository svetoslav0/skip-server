import { UserDTO } from "./data/users/UserDTO";

export class APISpecification {

    private readonly JSON_CONTENT_TYPE: string = "application/json";
    private readonly FORM_URLENCODED_CONTENT_TYPE: string = "application/x-www-form-urlencoded";

    public buildSpecification() {
        return {
            openapi: "3.0.0",
            info: {
                title: "SKIP API",
                description: "SKIP API Specification",
                version: "1.0.0"
            },
            paths: {
                "/users/register": {
                    post: this.buildUsersRegisterPath()
                },
                "/users/login": {
                    post: this.buildUsersLoginPath()
                },
                "/reports": {
                    post: this.buildReportsCreatePath()
                },
                "/reports/:id": {
                    put: this.buildReportsEditPath(),
                    delete: this.buildReportsDeletePath()
                },
                "/classes": {
                    post: this.buildClassesCreatePath()
                }
            },
            components: {
                schemas: {
                    RegisterUserSchema: this.buildRegisterUserSchema(),
                    LoginUserSchema: this.buildLoginUserSchema(),
                    CreateReportRequestSchema: this.buildCreateReportRequestSchema(),
                    EditReportRequestSchema: this.buildEditReportRequestSchema(),
                    CreateClassRequestSchema: this.buildCreateClassRequestSchema(),

                    LoginResponseSchema: this.buildLoginResponseSchema(),
                    CreatedUserResponseSchema: this.buildCreatedUserResponseSchema(),
                    CreateReportResponseSchema: this.buildCreateReportResponseSchema(),
                    EditReportResponseSchema: this.buildEditReportResponseSchema(),
                    DeleteReportResponseSchema: this.buildDeleteReportResponseSchema(),
                    CreateClassResponseSchema: this.buildCreateClassResponseSchema(),

                    BadRequestResponseSchema: this.buildBadRequestResponseSchema()
                }
            }
        }
    }

    private buildUsersRegisterPath() {
        return {
            summary: "Register a new user",
            description: "Register a new user and add it in the database",
            tags: [
                "Users"
            ],
            requestBody: {
                required: true,
                content: {
                    [this.FORM_URLENCODED_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/RegisterUserSchema"
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Message that shows that the user has been successfully added it the database and its ID",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/CreatedUserResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        }
    }

    private buildUsersLoginPath() {
        return {
            summary: "Logs in user",
            description: "Logs in user and gives an authorization token",
            tags: [
                "Users"
            ],
            requestBody: {
                required: true,
                content: {
                    [this.FORM_URLENCODED_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/LoginUserSchema"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Successfully logged in.",
                    headers: {
                        "auth-token": {
                            description: "Authorization token. This token will be user everywhere in the entire application to authorize and authenticate the user.",
                            schema: {
                                type: "string"
                            }
                        }
                    },
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/LoginResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        }
    }

    private buildReportsCreatePath() {
        return {
            summary: "Create new report",
            description: "Create new empty report and fill it with entities after that",
            tags: [
                "Reports"
            ],
            requestBody: {
                required: true,
                content: {
                    [this.FORM_URLENCODED_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/CreateReportRequestSchema"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Report was created successfully.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/CreateReportResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        }
    }

    private buildReportsEditPath() {
        return {
            summary: "Edit existing report",
            description: "Edit existing report. Only the passed fields will be updated.",
            tags: [
                "Reports"
            ],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The ID of the report.",
                    schema: {
                        type: "number",
                        minimum: 1
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    [this.FORM_URLENCODED_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/EditReportRequestSchema"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Report was successfully updated.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/EditReportResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        }
    }

    private buildReportsDeletePath() {
        return {
            summary: "Deletes a report",
            description: "Deletes a report with the given ID.",
            tags: [
                "Reports"
            ],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The ID of the report.",
                    schema: {
                        type: "number",
                        minimum: 1
                    }
                }
            ],
            responses: {
                200: {
                    description: "Report was successfully archived.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/DeleteReportResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        };
    }

    private buildClassesCreatePath() {
        return {
            summary: "Create new class.",
            description: "Create new class and give it a name",
            tags: [
                "Classes"
            ],
            requestBody: {
                required: true,
                content: {
                    [this.FORM_URLENCODED_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/CreateClassRequestSchema"
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Class was successfully created.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/CreateClassResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        }
    }

    private buildRegisterUserSchema() {
        return {
            type: "object",
            properties: {
                username: {
                    type: "string",
                    minLength: UserDTO.MIN_USERNAME_LENGTH,
                    maxLength: UserDTO.MAX_USERNAME_LENGTH,
                    example: "johnny"
                },
                password: {
                    type: "string",
                    minLength: UserDTO.MIN_PASSWORD_LENGTH,
                    maxLength: UserDTO.MAX_PASSWORD_LENGTH,
                    example: "3x@mPl3_p@$$w0rD"
                },
                email: {
                    type: "string",
                    format: "email",
                    example: "johnny_example@example.com"
                },
                firstName: {
                    type: "string",
                    example: "Johnny"
                },
                middleName: {
                    type: "string",
                    example: "Wilson"
                },
                lastName: {
                    type: "string",
                    example: "Manson"
                },
                roleId: {
                    type: "number",
                    example: 1
                }
            },
            required: [
                "username",
                "password",
                "email",
                "firstName",
                "lastName"
            ]
        };
    }

    private buildLoginUserSchema() {
        return {
            type: "object",
            properties: {
                username: {
                    type: "string",
                    example: "johnny"
                },
                password: {
                    type: "string",
                    example: "3x@mPl3_p@$$w0rD"
                }
            },
            required: [
                "username",
                "password"
            ]
        }
    }

    private buildCreateReportRequestSchema() {
        return {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    example: "September 2019"
                },
                userId: {
                    type: "number",
                    example: 12
                }
            },
            required: [
                "name",
                "userId"
            ]
        }
    }

    private buildEditReportRequestSchema() {
        return {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    example: "September 2019"
                },
                userId: {
                    type: "number",
                    example: 12
                }
            }
        }
    }

    private buildCreateClassRequestSchema() {
        return {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    example: "HTML5 & CSS3"
                },
                ageGroup: {
                    type: "string",
                    example: "4 - 6 Grade"
                }
            },
            required: [
                "name"
            ]
        }
    }

    private buildCreatedUserResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean"
                        },
                        message: {
                            type: "string"
                        },
                        userId: {
                            type: "integer"
                        }
                    }
                }
            }
        };
    }

    private buildLoginResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string"
                        }
                    }
                }
            }
        }
    }

    private buildCreateReportResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean"
                        },
                        reportId: {
                            type: "number",
                            description: "The ID of the new report"
                        },
                        message: {
                            type: "string"
                        }
                    }
                }
            }
        }
    }

    private buildEditReportResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean"
                        },
                        reportId: {
                            type: "number",
                            description: "The ID of the new report"
                        },
                        message: {
                            type: "string"
                        }
                    }
                }
            }
        }
    }

    private buildDeleteReportResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean"
                        },
                        message: {
                            type: "string"
                        }
                    }
                }
            }
        };
    }

    private buildCreateClassResponseSchema() {
        return  {
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean"
                        },
                        classId: {
                            type: "number",
                            description: "The ID of the new class"
                        },
                        message: {
                            type: "string"
                        }
                    }
                }
            }
        }
    }

    private buildBadRequestResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean"
                        },
                        message: {
                            type: "string"
                        },
                        errors: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        };
    }

    private buildCommonResponses() {
        return {
            400: {
                description: "The given request cannot be proceeded from the server due to something that is perceived to be a client error.",
                content: {
                    [this.JSON_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/BadRequestResponseSchema"
                        }
                    }
                }
            }
        }
    }
}
