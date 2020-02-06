export class UserResponseBuilder {

    public buildRegisterResponse(options: any) {
        return this.buildData({
            success: options.success,
            message: options.message,
            errors: options.errors
        });
    }

    public buildLoginResponse(options: any) {
        return this.buildData({
            message: options.resultMessage
        });
    }

    private buildData(data: any) {
        return {
            data: data
        }
    }
}
