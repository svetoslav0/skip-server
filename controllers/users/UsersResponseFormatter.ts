import { UserDTO } from "../../data/users/UserDTO";

export class UsersResponseFormatter {
    public formatGetUser(user: UserDTO) {
        return {
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            middleName: user.middleName || null,
            lastName: user.lastName,
            roleId: user.roleId,
            description: user.description || null
        };
    }
}
