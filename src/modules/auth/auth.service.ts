import {BadRequestException, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {CreateUserDto} from "../user/dto";
import {AppError} from "../../common/constants/errors";
import {UserLoginDto} from "./dto";
import * as bcrypt from "bcrypt";
import {AuthUserResponse} from "./response";

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService) {
    }

    async registerUser(dto: CreateUserDto): Promise<CreateUserDto> {
        const user = await this.userService.findUserByEmail(dto.email);
        if (user) {
            throw new BadRequestException(AppError.USER_EXIST);
        }
        return this.userService.createUser(dto);
    }

    async loginUser(dto: UserLoginDto): Promise<AuthUserResponse> {
        const user = await this.userService.findUserByEmail(dto.email);
        if (!user) {
            throw new BadRequestException(AppError.USER_NOT_EXIST)
        }
        const isValidPassword = await bcrypt.compare(dto.password, user.password)
        if (!isValidPassword) {
            throw new BadRequestException(AppError.WRONG_DATA);
        }
        return user;
    }
}
