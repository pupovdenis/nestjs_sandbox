import {IsEmail, IsString} from "class-validator";

export class CreateUserDto {
    @IsString()
    firstname: string

    @IsString()
    lastname: string

    @IsString()
    login: string

    @IsString()
    password: string

    @IsEmail()
    email: string
}