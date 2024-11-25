import {BadRequestException, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {CreateUserDto} from "../user/dto";
import {AppError} from "../../common/constants/errors";
import {UserLoginDto} from "./dto";
import * as bcrypt from "bcrypt";
import {TokenService} from "../token/token.service";
import {AuthUserResponse} from "./response";

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService,
                private readonly tokenService: TokenService) {
    }

    async registerUser(dto: CreateUserDto): Promise<CreateUserDto> {
        try {
            const user = await this.userService.findUserByEmail(dto.email);
            if (user) {
                throw new BadRequestException(AppError.USER_EXIST);
            }
            return this.userService.createUser(dto);
        } catch (e) {
            throw new Error(e);
        }
    }

    async loginUser(dto: UserLoginDto): Promise<AuthUserResponse> {
        try {
            let user = await this.userService.findUserByEmail(dto.email);
            if (!user) {
                throw new BadRequestException(AppError.USER_NOT_EXIST);
            }
            const isValidPassword = await bcrypt.compare(dto.password, user.password);
            if (!isValidPassword) {
                throw new BadRequestException(AppError.WRONG_DATA);
            }
            user = await this.userService.getPublicUser(dto.email);
            const token = await this.tokenService.generateJwtToken(user);
            return {user, token};
        } catch (e) {
            throw new Error(e);
        }
    }
}
