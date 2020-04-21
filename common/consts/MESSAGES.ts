import { CONSTRAINTS } from "./CONSTRAINTS";

export const MESSAGES = {
    ERRORS: {
        AUTH: {
            AUTHORIZATION_MAIN_ERROR_MESSAGE: "Authorization error",
            FORBIDDEN_RESOURCE_MESSAGE: "Access denied. You do not have rights to do this action!",
            INVALID_TOKEN_MESSAGE: "Access denied. Provided token is invalid.",
            NO_TOKEN_MESSAGE: "Access denied. No token was provided."
        },
        CLASS_ROLES: {
            ARCHIVE_GENERAL_FAILED_MESSAGE: "Class Roles with given parameters cannot be archived.",
            ID_FIELD_NOT_DEFINED_MESSAGE: "Class Role ID is not defined!",
            ID_FIELD_NOT_EXISTING_MESSAGE: "The provided Class Role ID does not exist!",
            NAME_FIELD_NOT_DEFINED_MESSAGE: "Field 'name' is not defined!",
            PAYMENT_FIELD_NOT_DEFINED_MESSAGE: "Field 'paymentPerHour' is not defined!",
            PAYMENT_FIELD_NOT_NUMERIC_MESSAGE: "Field 'paymentPerHour' is not a number!",
            PAYMENT_FIELD_IS_NEGATIVE_MESSAGE: "Field 'paymentPerHour' is negative!"
        },
        CLASSES: {
            ARCHIVE_GENERAL_FAILED_MESSAGE: "Class with given parameters cannot be archived.",
            ID_FIELD_NOT_DEFINED_MESSAGE: "Class ID is not provided!",
            ID_FIELD_NOT_EXISTING_MESSAGE: "The provided class ID does not exist!",
            NAME_FIELD_NOT_DEFINED_MESSAGE: "Field 'name' is not defined!"
        },
        COMMON: {
            FAILED_UPDATING_RESOURCE: "Resource with the given parameters cannot be updated!",
            GENERAL_ERROR_MESSAGE: "Something went wrong...",
            NON_NUMERIC_ID_PARAM_MESSAGE: "The given ID parameter is not numeric"
        },
        REPORTS: {
            ARCHIVE_GENERAL_FAILED_MESSAGE: "Report with given parameters cannot be archived.",
            ID_FIELD_NOT_DEFINED_MESSAGE: "Report ID is not defined!",
            ID_FIELD_NOT_EXISTING_MESSAGE: "Report ID does not existing!",
            NAME_FIELD_NOT_DEFINED_MESSAGE: "Field 'name' is required!",
            USER_ID_FIELD_NOT_DEFINED_MESSAGE: "Field 'userId' is required!",
            USER_ID_FIELD_NOT_EXISTING_MESSAGE: "The given 'userId' does not exist!"
        },
        USERS: {
            EMAIL_EXISTS_MESSAGE: "An user has already been registered with this email. Please choose another one.",
            EMAIL_FIELD_NOT_DEFINED_MESSAGE: "Field 'email' is required!",
            EMAIL_FIELD_IS_INVALID_MESSAGE: "Email seems to be invalid.",
            FIRST_NAME_FIELD_NOT_DEFINED_MESSAGE: "Field 'firstName' is not defined!",
            LAST_NAME_FIELD_NOT_DEFINED_MESSAGE: "Field 'lastName' is not defined!",
            LOGIN_FAILED_MESSAGE: "Wrong username or password.",
            PASSWORD_FIELD_NOT_DEFINED_MESSAGE: "Field 'password' is not defined!",
            PASSWORD_FIELD_TOO_LONG: `The password seems to be too long. Must be not more than ${CONSTRAINTS.USERS.MAX_PASSWORD_LENGTH} characters long.`,
            PASSWORD_FIELD_TOO_SHORT: `Password is too short. Must be at least ${CONSTRAINTS.USERS.MIN_PASSWORD_LENGTH} characters long.`,
            REGISTER_FAILED_MESSAGE: "The given request is invalid. Some errors have appeared.",
            USERNAME_EXISTS_MESSAGE: "An user has already been registered with this username. Please choose another one.",
            USERNAME_FIELD_NOT_DEFINED_MESSAGE: "Field 'username' is required!",
            USERNAME_FIELD_TOO_LONG_MESSAGE: `Username is too long. Must be not more than ${CONSTRAINTS.USERS.MAX_USERNAME_LENGTH} characters long.`,
            USERNAME_FIELD_TOO_SHORT_MESSAGE: `Username is too short. Must be at least ${CONSTRAINTS.USERS.MIN_USERNAME_LENGTH} characters long.`
        }
    },
    SUCCESSES: {
        CLASS_ROLES: {
            SUCCESSFUL_CREATION_MESSAGE: "Class Role was successfully created.",
            SUCCESSFUL_UPDATED_MESSAGE: "Class Role was successfully updated.",
            SUCCESSFUL_ARCHIVED_MESSAGE: "Class Role was successfully archived."
        },
        CLASSES: {
            SUCCESSFUL_CREATION_MESSAGE: "Class was successfully created.",
            SUCCESSFUL_UPDATED_MESSAGE: "Class was successfully updated.",
            SUCCESSFUL_ARCHIVED_MESSAGE: "Class was successfully archived."
        },
        REPORTS: {
            SUCCESSFUL_CREATION_MESSAGE: "Report was successfully created.",
            SUCCESSFUL_UPDATED_MESSAGE: "Report was successfully updated.",
            SUCCESSFUL_ARCHIVED_MESSAGE: "Report was successfully archived."
        },
        USERS: {
            LOGIN_SUCCESS_MESSAGE: "Logged in successfully",
            REGISTER_SUCCESS_MESSAGE: "User registered successfully."
        }
    }
};
