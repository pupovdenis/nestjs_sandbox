import {Body, Controller, Delete, Patch, Req, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {UpdateUserDto} from "./dto";
import {JwtAuthGuard} from "../../guards/jwt-guard";
import {ApiResponse, ApiTags} from "@nestjs/swagger";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @ApiTags("API")
    @ApiResponse({status: 201, type: UpdateUserDto})
    @UseGuards(JwtAuthGuard)
    @Patch()
    updateUser(@Body() dto: UpdateUserDto, @Req() request): Promise<UpdateUserDto> {
        const user = request.user;
        console.log("user from request: ", user)
        console.log("dto from body: ", dto)
        return this.userService.updateUser(user.email, dto);
    }

    @ApiTags("API")
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @Delete()
    deleteUser(@Req() request): Promise<boolean> {
        const user = request.user;
        return this.userService.deleteUser(user.email);
    }
}
