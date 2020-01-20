export class UserResponseBuilder {

    static buildRegisterResponse(options: any) {
        return {
            success: options.success,
            message: options.message,
            errors: options.errors
        }
    }

    static buildLoginResponse(options: any) {
        return {
            message: options.resultMessage
        }
    }
}