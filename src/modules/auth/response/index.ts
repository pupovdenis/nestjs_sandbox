import {IsString} from "class-validator";

export class AuthUserResponse {

    @IsString()
    firstname: string

    @IsString()
    login: string

    @IsString()
    email: string

    @IsString()
    password: string

    @IsString()
    token: string
}