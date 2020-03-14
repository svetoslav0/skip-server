import { UserDTO } from "./data/users/UserDTO";

export class APISpecification {
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
                }
            },
            components: {
                schemas: {
                    RegisterUserSchema: this.buildRegisterUserSchema(),
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
            requestBody: {
                required: true,
                content: {
                    "application/x-www-form-ulrencoded": {
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
                                $ref: "#/components/schemas/CreatedResponseSchema"
                            }
                        }
                    }
                },
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
}
