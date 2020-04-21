import { CONSTRAINTS } from "./common/consts/CONSTRAINTS";

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
                },
                "/classes/:id": {
                    put: this.buildClassesEditPath(),
                    delete: this.buildClassesDeletePath()
                },
                "/classRoles": {
                    post: this.buildClassRolesCreatePath()
                },
                "/classRoles/:id": {
                    put: this.buildClassRolesEditPath()
                }
            },
            components: {
                parameters: {
                    authHeaderParam: {
                        in: "header",
                        name: "auth-header",
                        schema: {
                            type: "string"
                        },
                        required: true
                    }
                },
                schemas: {
                    RegisterUserSchema: this.buildRegisterUserSchema(),
                    LoginUserSchema: this.buildLoginUserSchema(),
                    CreateReportRequestSchema: this.buildCreateReportRequestSchema(),
                    EditReportRequestSchema: this.buildEditReportRequestSchema(),
                    CreateClassRequestSchema: this.buildCreateClassRequestSchema(),
                    EditClassRequestSchema: this.buildEditClassRequestSchema(),
                    CreateClassRoleRequestSchema: this.buildCreateClassRoleRequestSchema(),
                    EditClassRoleRequestSchema: this.buildEditClassRoleRequestSchema(),

                    LoginResponseSchema: this.buildLoginResponseSchema(),
                    CreatedUserResponseSchema: this.buildCreatedUserResponseSchema(),
                    CreateReportResponseSchema: this.buildCreateReportResponseSchema(),
                    EditReportResponseSchema: this.buildEditReportResponseSchema(),
                    DeleteReportResponseSchema: this.buildDeleteReportResponseSchema(),
                    CreateClassResponseSchema: this.buildCreateClassResponseSchema(),
                    EditClassResponseSchema: this.buildEditClassResponseSchema(),
                    DeleteClassResponseSchema: this.buildDeleteClassResponseSchema(),
                    CreateClassRoleResponseSchema: this.buildCreateClassRoleResponseSchema(),
                    EditClassRoleResponseSchema: this.buildEditClassRoleResponseSchema(),

                    BadRequestResponseSchema: this.buildBadRequestResponseSchema(),
                    UnauthorizedResponseSchema: this.buildUnauthorizedResponseSchema(),
                    ForbiddenResponseSchema: this.buildForbiddenResponseSchema()
                }
            }
        };
    }

    private buildUsersRegisterPath() {
        return {
            summary: "Register a new user",
            description: "Register a new user and add it in the database",
            tags: [
                "Users"
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/authHeaderParam"
                }
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
        };
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
                ...this.buildCommonResponses(false)
            }
        };
    }

    private buildReportsCreatePath() {
        return {
            summary: "Create new report",
            description: "Create new empty report and fill it with entities after that",
            tags: [
                "Reports"
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/authHeaderParam"
                }
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
                201: {
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
        };
    }

    private buildReportsEditPath() {
        return {
            summary: "Edit existing report",
            description: `Edit existing report. Only the passed fields will be updated.
                Administrators can execute this operation for every report,
                while employees can update only their reports.`,
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
                },
                {
                    $ref: "#/components/parameters/authHeaderParam"
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
        };
    }

    private buildReportsDeletePath() {
        return {
            summary: "Deletes a report",
            description: "Deletes a report with the given ID. " +
                "Administrators can execute this operation for every report, " +
                "while employees can archive only their reports. " +
                "The report is not actually deleted, its status is updated to 'Archived'",
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
                },
                {
                    $ref: "#/components/parameters/authHeaderParam"
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
            parameters: [
                {
                    $ref: "#/components/parameters/authHeaderParam"
                }
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
        };
    }

    private buildClassesEditPath() {
        return {
            summary: "Edit class",
            description: "Edit existing class. Only the passed fields will be updated.",
            tags: [
                "Classes"
            ],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The ID of the class.",
                    schema: {
                        type: "number",
                        minimum: 1
                    }
                },
                {
                    $ref: "#/components/parameters/authHeaderParam"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    [this.FORM_URLENCODED_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/EditClassRequestSchema"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Class was successfully updated.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/EditClassResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        };
    }

    private buildClassesDeletePath() {
        return {
            summary: "Deletes a class",
            description: "Deletes a class with given ID. " +
                "This operation can be executed only by administrators. " +
                "The class is not actually deleted, its status is updated to 'Archived'",
            tags: [
                "Classes"
            ],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The ID of the class.",
                    schema: {
                        type: "number",
                        minimum: 1
                    }
                },
                {
                    $ref: "#/components/parameters/authHeaderParam"
                }
            ],
            responses: {
                200: {
                    description: "Class was successfully archived.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/DeleteClassResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        };
    }

    private buildClassRolesCreatePath() {
        return {
            summary: "Create new Class Role",
            description: "Create new Class Role. 'Class Role' is a role (activity) that one person can do. " +
                "He/she can be a lecturer, co-lecture, assistant etc. Depending on his role, employee gets " +
                "different value of payment. New Class Roles can be added only from administrators.",
            tags: [
                "Class Roles"
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/authHeaderParam"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    [this.FORM_URLENCODED_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/CreateClassRoleRequestSchema"
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Class Role was created successfully",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/CreateClassRoleResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        };
    }

    private buildClassRolesEditPath() {
        return {
            summary: "Update existing Class Role",
            description: "Update an existing Class Role. Only provided fields will be validated " +
                "and eventually updated.",
            tags: [
                "Class Roles"
            ],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The ID of the class role",
                    schema: {
                        type: "number",
                        minimum: 1
                    }
                },
                {
                    $ref: "#/components/parameters/authHeaderParam"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    [this.FORM_URLENCODED_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/EditClassRoleRequestSchema"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Class Role was successfully updated.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/EditClassRoleResponseSchema"
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
                    minLength: CONSTRAINTS.USERS.MIN_USERNAME_LENGTH,
                    maxLength: CONSTRAINTS.USERS.MAX_USERNAME_LENGTH,
                    example: "johnny"
                },
                password: {
                    type: "string",
                    minLength: CONSTRAINTS.USERS.MIN_PASSWORD_LENGTH,
                    maxLength: CONSTRAINTS.USERS.MAX_PASSWORD_LENGTH,
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
        };
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
        };
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
        };
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
        };
    }

    private buildEditClassRequestSchema() {
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
            }
        };
    }

    private buildCreateClassRoleRequestSchema() {
        return {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    example: "Lecturer"
                },
                paymentPerHour: {
                    type: "number",
                    example: 15,
                    minimum: 0
                }
            }
        }
    }

    private buildEditClassRoleRequestSchema() {
        return {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    example: "Co-Lecturer"
                },
                paymentPerHour: {
                    type: "number",
                    example: 12,
                    minimum: 0
                }
            }
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
        };
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
        };
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
        };
    }

    private buildDeleteReportResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },
                        message: {
                            type: "string",
                            example: "Report was successfully archived"
                        }
                    }
                }
            }
        };
    }

    private buildDeleteClassResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },
                        message: {
                            type: "string",
                            example: "Class was successfully archived."
                        }
                    }
                }
            }
        }
    }

    private buildCreateClassRoleResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },
                        classRoleId: {
                            type: "number",
                            description: "The ID of the new Class Role",
                            example: 14
                        },
                        message: {
                            type: "string",
                            example: "Class Role was successfully created."
                        }
                    }
                }
            }
        }
    }

    private buildEditClassRoleResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },
                        classRoleId: {
                            type: "number",
                            example: 15
                        },
                        message: {
                            type: "string",
                            example: "Class Role was updated successfully."
                        }
                    }
                }
            }
        }
    }

    private buildCreateClassResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },
                        classId: {
                            type: "number",
                            description: "The ID of the new class",
                            example: 154
                        },
                        message: {
                            type: "string",
                            example: "Class was successfully created"
                        }
                    }
                }
            }
        };
    }

    private buildEditClassResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },
                        classId: {
                            type: "number",
                            description: "The ID of the updated class",
                            example: "14"
                        },
                        message: {
                            type: "string",
                            example: "Class was successfully updated"
                        }
                    }
                }
            }
        };
    }

    private buildBadRequestResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: "false"
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

    private buildUnauthorizedResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false
                        },
                        message: {
                            type: "string"
                        },
                        error: {
                            type: "string"
                        }
                    }
                }
            }
        };
    }

    private buildForbiddenResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false
                        },
                        message: {
                            type: "string"
                        },
                        error: {
                            type: "string"
                        }
                    }
                }
            }
        };
    }

    private buildCommonResponses(withAuth: boolean = true) {
        let response: any = {
            400: {
                description: "The given request cannot be proceeded from the server due to something that is perceived to be a client error.",
                content: {
                    [this.JSON_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/BadRequestResponseSchema"
                        }
                    }
                }
            },

        };

        if (withAuth) {
            response[401] = {
                description: "Either no token was provided or the provided token is invalid",
                content: {
                    [this.JSON_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/UnauthorizedResponseSchema"
                        }
                    }
                }
            };

            response[403] = {
                description: "Provided token is valid, but the user does not have rights to execute this action",
                content: {
                    [this.JSON_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/ForbiddenResponseSchema"
                        }
                    }
                }
            };
        }

        return response;
    }
}
