import { UserDTO } from "./data/users/UserDTO";

export class APISpecification {

    private readonly FORM_URLENCODED_CONTENT: string = "application/x-www-form-urlencoded";

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
                }
            },
            components: {
                schemas: {
                    RegisterUserSchema: this.buildRegisterUserSchema(),
                    LoginUserSchema: this.buildLoginUserSchema(),
                    OkResponseSchema: this.buildOkResponseSchema(),
                    CreatedUserResponseSchema: this.buildCreatedUserResponseSchema(),
                    BadRequestResponseSchema: this.buildBasRequestResponseSchema()
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
                    [this.FORM_URLENCODED_CONTENT]: {
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
                        "application/json": {
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
                    [this.FORM_URLENCODED_CONTENT]: {
                        schema: {
                            $ref: "#/components/schemas/LoginUserSchema"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "The operation was done successfully.",
                    headers: {
                        "auth-token": {
                            description: "Authorization token. This token will be user everywhere in the entire application to authorize and authenticate the user.",
                            schema: {
                                type: "string"
                            }
                        }
                    },
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/OkResponseSchema"
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

    private buildOkResponseSchema() {
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

    private buildBasRequestResponseSchema() {
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
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/BadRequestResponseSchema"
                        }
                    }
                }
            }
        }
    }
}
