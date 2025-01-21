import {ReadUserDto} from "../dto/read.user.dto";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";

export class UserMapper {
    static toDto(entity: UserRepresentation): ReadUserDto {
        return {
            id: entity.id,
            username: entity.username,
            firstname: entity.firstName,
            middleName: entity.attributes['middleName'][0],
            lastname: entity.lastName,
            email: entity.email
        };
    }
}
