import {AbstractResponseBuilder} from "../AbstractResponseBuilder";

export class UserResponseBuilder extends AbstractResponseBuilder{

    public buildRegisterResponse(options: any) {
        return this.buildData({
            success: options.success,
            message: options.message,
            userId: options.userId,
            errors: options.errors
        });
    }

    public buildLoginResponse(options: any) {
        return this.buildData({
            message: options.resultMessage
        });
    }
}
