import {IsEmail, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    firstname: string

    @ApiProperty()
    @IsString()
    lastname: string

    @ApiProperty()
    @IsString()
    login: string

    @ApiProperty()
    @IsString()
    password: string

    @ApiProperty()
    @IsEmail()
    email: string
}