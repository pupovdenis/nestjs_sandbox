import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import * as bcrypt from "bcrypt";
import {CreateUserDto} from "./dto";
import {AppError} from "../../common/errors";

@Injectable()
export class UserService {

    constructor(@InjectModel(User) private readonly userRepository: typeof User) {
    }

    async encrypt(password) {
        return bcrypt.hash(password, 10);
    }

    async createUser(dto): Promise<CreateUserDto> {
        const user = await this.findUserByEmail(dto.email);
        if (user) {
            throw new BadRequestException(AppError.USER_EXIST);
        }
        dto.password = await this.encrypt(dto.password);
        await this.userRepository.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            login: dto.login,
            password: dto.password,
            email: dto.email
        });
        return dto;
    }

    async findUserByEmail(email: string) {
        return this.userRepository.findOne({rejectOnEmpty: undefined, where: {email: email}})
    }
}
