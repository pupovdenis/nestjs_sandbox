import {Body, Controller, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post()
    createUser(@Body() dto: CreateUserDto) {
        console.log(dto)
        return this.userService.createUser(dto);
    }
}
