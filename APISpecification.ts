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
                "/users/:id": {
                    get: this.buildGetUserByIdPath()
                },
                "/reports": {
                    get: this.buildGetReportsForUser(),
                    post: this.buildReportsCreatePath()
                },
                "/reports/:id": {
                    get: this.buildGetReportByIdPath(),
                    put: this.buildReportsEditPath(),
                    delete: this.buildReportsDeletePath()
                },
                "/classes": {
                    post: this.buildClassesCreatePath(),
                    get: this.buildGetClassesPath(),
                },
                "/classes/:id": {
                    put: this.buildClassesEditPath(),
                    delete: this.buildClassesDeletePath()
                },
                "/classRoles": {
                    post: this.buildClassRolesCreatePath()
                },
                "/classRoles/:id": {
                    put: this.buildClassRolesEditPath(),
                    delete: this.buildClassRolesDeletePath()
                },
                "/reportEntities": {
                    post: this.buildReportEntitiesCreatePath()
                },
                "/reportEntities/:id": {
                    put: this.buildReportEntitiesEditPath(),
                    delete: this.buildReportEntitiesDeletePath()
                }
            },
            components: {
                parameters: {
                    authHeaderParam: {
                        in: "header",
                        name: "auth-token",
                        schema: {
                            type: "string"
                        },
                        required: true
                    },
                    idParam: {
                        in: "path",
                        name: "id",
                        description: "The ID of the resource",
                        schema: {
                            type: "number"
                        },
                        required: true
                    },
                    userIdParam: {
                        in: "path",
                        name: "id",
                        description: "The User ID",
                        schema: {
                            type: "number"
                        },
                        required: true
                    },
                    reportIdParam: {
                        in: "path",
                        name: "id",
                        description: "The Report ID",
                        schema: {
                            type: "number"
                        },
                        required: true
                    }
                },
                schemas: {
                    ReportEntitiesSchema: this.buildReportEntitiesSchema(),

                    RegisterUserSchema: this.buildRegisterUserSchema(),
                    LoginUserSchema: this.buildLoginUserSchema(),
                    CreateReportRequestSchema: this.buildCreateReportRequestSchema(),
                    EditReportRequestSchema: this.buildEditReportRequestSchema(),
                    CreateClassRequestSchema: this.buildCreateClassRequestSchema(),
                    EditClassRequestSchema: this.buildEditClassRequestSchema(),
                    CreateClassRoleRequestSchema: this.buildCreateClassRoleRequestSchema(),
                    EditClassRoleRequestSchema: this.buildEditClassRoleRequestSchema(),
                    CreateReportEntityRequestSchema: this.buildCreateReportEntityRequestSchema(),
                    EditReportEntityRequestSchema: this.buildEditReportEntityRequestSchema(),

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
                    DeleteClassRolesResponseSchema: this.buildDeleteClassRolesResponseSchema(),
                    CreateReportEntityResponseSchema: this.buildCreateReportEntityResponseSchema(),
                    EditReportEntityResponseSchema: this.buildEditReportEntityResponseSchema(),
                    DeleteReportEntityResponseSchema: this.buildDeleteReportEntityResponseSchema(),
                    GetUserByIdResponseSchema: this.buildGetUserByIdResponseSchema(),
                    GetReportByIdResponseSchema: this.buildGetReportByIdResponseSchema(),
                    GetReportsForUserResponseSchema: this.buildGetReportsForUserResponseSchema(),
                    GetAllClassesResponseSchema: this.buildGetAllClassesResponseSchema(),

                    BadRequestResponseSchema: this.buildBadRequestResponseSchema(),
                    UnauthorizedResponseSchema: this.buildUnauthorizedResponseSchema(),
                    ForbiddenResponseSchema: this.buildForbiddenResponseSchema()
                }
            }
        };
    }

    private buildGetUserByIdPath() {
        return {
            summary: "Get user by ID",
            description: "This methods returns a user by his ID",
            tags: [
                "Users"
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/userIdParam"
                }
            ],
            responses: {
                200: {
                    description: "OK. Response with user data is returned.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/GetUserByIdResponseSchema"
                            }
                        }
                    }
                },
            ...this.buildCommonResponses()
            }
        };
    }

    private buildGetReportsForUser() {
        return {
            summary: "Get all Reports with its Report Entities for a user",
            description: "This method returns list of all available non-archived Reports. " +
                "Lists of all Report Entities that belong to the return Reports is also included. " +
                "To get Reports for a specific user 'userId' parameter is not needed. " +
                "User is identified by the given 'auth-token' header",
            tags: [
                "Reports"
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/authHeaderParam"
                }
            ],
            responses: {
                200: {
                    description: "OK. List of all available non-archive reports is returned.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/GetReportsForUserResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
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
                    headers: {
                        "auth-token": {
                            schema: {
                                type: "string"
                            },
                            description: "Token used to identify the user"
                        }
                    },
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
            description: "Create new empty report and fill it with entities after that. " +
                "The created report is automatically associated to the user who created it.",
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

    private buildGetReportByIdPath() {
        return {
            summary: "Get report by its ID",
            description: "This method returns a report with all report entities " +
                "that are associated with it",
            tags: [
                "Reports"
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/authHeaderParam"
                },
                {
                    $ref: "#/components/parameters/reportIdParam"
                }
            ],
            responses: {
                200: {
                    description: "OK. Response with report data is returned.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/GetReportByIdResponseSchema"
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
                    $ref: "#/components/parameters/authHeaderParam"
                },
                {
                    $ref: "#/components/parameters/idParam"
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
                    $ref: "#/components/parameters/authHeaderParam"
                },
                {
                    $ref: "#/components/parameters/idParam"
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

    private buildGetClassesPath() {
        return {
            summary: "Get all classes",
            description: "This method return all available non-archived classes",
            tags: [
                "Classes"
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/authHeaderParam"
                }
            ],
            responses: {
                200: {
                    description: "OK. List of all available non-archived Classes is returned.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/GetAllClassesResponseSchema"
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
                    $ref: "#/components/parameters/authHeaderParam"
                },
                {
                    $ref: "#/components/parameters/idParam"
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
                    $ref: "#/components/parameters/authHeaderParam"
                },
                {
                    $ref: "#/components/parameters/idParam"
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
                    $ref: "#/components/parameters/authHeaderParam"
                },
                {
                    $ref: "#/components/parameters/idParam"
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
        };
    }

    private buildClassRolesDeletePath() {
        return {
            summary: "Archives existing Class Role",
            description: "Archives a Class Role without actually deleting it from the database. " +
                "This action can be executed only by users with role ADMIN.",
            tags: [
                "Class Roles"
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/authHeaderParam"
                },
                {
                    $ref: "#/components/parameters/idParam"
                }
            ],
            responses: {
                200: {
                    description: "Class Role was successfully archived.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/DeleteClassRolesResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        };
    }

    private buildReportEntitiesCreatePath() {
        return {
            summary: "Create new Report Entity",
            description: "Create new Report Entity. It represents a single record of a report " +
                "and contains information about a single given lesson with one group. An entity can " +
                "be created in two different ways with this method. The first way is to provide an existing " +
                "Report ID and this entity will be attached to this report. The second way is to created " +
                "an entity and NOT to provide Report ID. Thus providing an option to create a report " +
                "at a later stage and then to use PUT /reportEntities/{id} to associate the entity with the report. " +
                "The created entity is automatically associated to the logged user.",
            tags: [
                "Report Entities"
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
                            $ref: "#/components/schemas/CreateReportEntityRequestSchema"
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Report Entity was successfully created.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/CreateReportEntityResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        };
    }

    private buildReportEntitiesEditPath() {
        return {
            summary: "Update existing Report Entity",
            description: "Update an existing Report Entity. Only provided fields will be " +
                "validated and eventually updated.",
            tags: [
                "Report Entities"
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/authHeaderParam"
                },
                {
                    $ref: "#/components/parameters/idParam"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    [this.FORM_URLENCODED_CONTENT_TYPE]: {
                        schema: {
                            $ref: "#/components/schemas/EditReportEntityRequestSchema"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Report Entity was successfully updated.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/EditReportEntityResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        };
    }

    private buildReportEntitiesDeletePath() {
        return {
            summary: "Archives existing Report Entity",
            description: "Archives a Report Entity without actually deleting it from the database. " +
                "This action be executed by all users with role ADMIN or by users by users with " +
                "role EMPLOYEE but only in case the requested Report Entity belongs to them.",
            tags: [
                "Report Entities"
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/authHeaderParam"
                },
                {
                    $ref: "#/components/parameters/idParam"
                }
            ],
            responses: {
                200: {
                    description: "Report Entity was successfully archived.",
                    content: {
                        [this.JSON_CONTENT_TYPE]: {
                            schema: {
                                $ref: "#/components/schemas/DeleteReportEntityResponseSchema"
                            }
                        }
                    }
                },
                ...this.buildCommonResponses()
            }
        };
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
                },
                description: {
                    type: "string",
                    description: "Some words describing the user"
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
                description: {
                    type: "string",
                    description: "Some words describing the object"
                }
            },
            required: [
                "name"
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
                },
                describe: {
                    type: "string",
                    description: "Some words describing the object"
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
                },
                description: {
                    type: "string",
                    example: "Some description"
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
                },
                description: {
                    type: "string",
                    example: "Some description"
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
                },
                description: {
                    type: "string",
                    example: "Some description"
                }
            },
            required: [
                "name",
                "paymentPerHour"
            ]
        };
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
                },
                description: {
                    type: "string",
                    example: "Some description"
                }
            }
        };
    }

    private buildCreateReportEntityRequestSchema() {
        return {
            type: "object",
            properties: {
                reportId: {
                    type: "number",
                    description: "ID of an existing report",
                    example: 15
                },
                classId: {
                    type: "number",
                    description: "ID of an existing class",
                    example: 3
                },
                classRoleId: {
                    type: "number",
                    description: "ID of an existing class role",
                    example: 2
                },
                date: {
                    type: "string",
                    description: "The date of the given lesson in format 'YYYY/MM/DD'",
                    example: "2020/01/13"
                },
                hoursSpend: {
                    type: "number",
                    description: "The length of the lesson in hours",
                    example: 2
                },
                description: {
                    type: "string",
                    description: "Some words describing the object"
                }
            },
            required: [
                "classId",
                "classRoleId",
                "date",
                "hoursSpend"
            ]
        };
    }

    private buildEditReportEntityRequestSchema() {
        return {
            type: "object",
            properties: {
                reportId: {
                    type: "number",
                    description: "ID of an existing report",
                    example: 15
                },
                classId: {
                    type: "number",
                    description: "ID of an existing class",
                    example: 3
                },
                classRoleId: {
                    type: "number",
                    description: "ID of an existing class role",
                    example: 2
                },
                date: {
                    type: "string",
                    description: "The date of the given lesson in format 'YYYY/MM/DD'",
                    example: "2020/01/13"
                },
                hoursSpend: {
                    type: "number",
                    description: "The length of the lesson in hours",
                    example: 2
                },
                description: {
                    type: "string",
                    description: "Some words describing the object"
                }
            }
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
                        resourceId: {
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
                        resourceId: {
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
        };
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
                        resourceId: {
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
        };
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
                        resourceId: {
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
        };
    }

    private buildDeleteClassRolesResponseSchema() {
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
                            example: "Class Role was successfully archived."
                        }
                    }
                }
            }
        };
    }

    private buildCreateReportEntityResponseSchema() {
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
                        resourceId: {
                            type: "number",
                            description: "The ID of the new Report Entity",
                            example: 15
                        },
                        message: {
                            type: "string",
                            example: "Class Role was successfully created."
                        }
                    }
                }
            }
        };
    }

    private buildEditReportEntityResponseSchema() {
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
                        resourceId: {
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
        };
    }

    private buildDeleteReportEntityResponseSchema() {
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
                            example: "Report Entities was successfully archived."
                        }
                    }
                }
            }
        };
    }

    private buildGetUserByIdResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        username: {
                            type: "string",
                            description: "The username of the user. It is user to login.",
                            example: "pesho"
                        },
                        email: {
                            type: "string",
                            description: "The email of the user.",
                            example: "pesho@gmail.com"
                        },
                        firstName: {
                            type: "string",
                            description: "First name of the user",
                            example: "Pesho"
                        },
                        middleName: {
                            type: "string",
                            description: "The middle name of the user",
                            example: "Peshov"
                        },
                        lastName: {
                            type: "string",
                            description: "The last name (surname) of the user",
                            example: "Peshov"
                        },
                        roleId: {
                            type: "number",
                            description: "Show the role of the user in the application" +
                                "\n 1 - Employee\n 2 - Administrator",
                            example: 1
                        },
                        description: {
                            type: "string",
                            description: "Optional description of the user profile",
                            example: "Some words describing the user"
                        }
                    }
                }
            }
        };
    }

    private buildGetReportByIdResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "The name of the report",
                            example: "January 2021"
                        },
                        userId: {
                            type: "number",
                            description: "The ID of the user that owns the report",
                            example: 25
                        },
                        description: {
                            type: "string",
                            description: "Some words describing the Report",
                            example: "Report scope: 04.01 - 01.02"
                        },
                        reportEntities: {
                            type: "array",
                            description: "List of all Report Entities that belong to the requested Report",
                            items: {
                                $ref: "#/components/schemas/ReportEntitiesSchema"
                            }
                        }
                    }
                }
            }
        };
    }

    private buildGetReportsForUserResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        count: {
                            type: "number",
                            description: "The count of the returned Reports",
                            example: 16
                        },
                        reports: {
                            type: "array",
                            description: "List of the available Report Entities",
                            items: {
                                properties: {
                                    name: {
                                        type: "string",
                                        description: "The name of the Report Entity",
                                        example: "September 2020"
                                    },
                                    userId: {
                                        type: "number",
                                        description: "The User ID of the owner of the Report Entity",
                                        example: 14
                                    },
                                    description: {
                                        type: "string",
                                        description: "Some words describing the Report Entity",
                                        example: "The final lesson"
                                    },
                                    reportEntities: {
                                        type: "array",
                                        description: "A list of Report Entities",
                                        items: {
                                            $ref: "#/components/schemas/ReportEntitiesSchema"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }

    private buildGetAllClassesResponseSchema() {
        return {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        count: {
                            type: "number",
                            description: "The count of all Classes",
                            example: 15
                        },
                        classes: {
                            type: "array",
                            description: "List of all non-archived Classes",
                            items: {
                                properties: {
                                    id: {
                                        type: "number",
                                        description: "The ID of the Class",
                                        example: 13
                                    },
                                    name: {
                                        type: "string",
                                        description: "The name of the Class",
                                        example: "First Steps with Scratch"
                                    },
                                    ageGroup: {
                                        type: "string",
                                        description: "The age group of the Class",
                                        example: "7 - 12 Grade"
                                    },
                                    description: {
                                        type: "string",
                                        description: "Some words describing the Class",
                                        example: "Some words"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }

    private buildReportEntitiesSchema() {
        return {
            properties: {
                id: {
                    type: "number",
                    description: "The ID of the Report Entity",
                    example: 225
                },
                date: {
                    type: "string",
                    description: "The date of the Report Entity entry",
                    example: "2021-01-14 00:00:00.000"
                },
                className: {
                    type: "string",
                    description: "The name of the Class of the Report Entity",
                    example: "Scratch Games"
                },
                classRoleName: {
                    type: "string",
                    description: "The name of the Class Role of the Report Entity; " +
                        "The role that the user took during the lesson",
                    example: "Lecturer"
                },
                hoursSpend: {
                    type: "string",
                    description: "The duration for which the activity was performed in hours",
                    example: 2
                },
                description: {
                    type: "string",
                    description: "Some words describing the Report Entity entry",
                    example: "The introduction lesson"
                }
            }
        };
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
                        resourceId: {
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
                        resourceId: {
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
        const response: any = {
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
