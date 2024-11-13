import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import * as bcrypt from "bcrypt";
import {CreateUserDto, UpdateUserDto} from "./dto";

@Injectable()
export class UserService {

    constructor(@InjectModel(User) private readonly userRepository: typeof User) {
    }

    async encrypt(password) {
        return bcrypt.hash(password, 10);
    }

    async createUser(dto): Promise<CreateUserDto> {
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
        return this.userRepository.findOne({rejectOnEmpty: undefined, where: {email: email}});
    }

    async updateUser(email: string, dto: UpdateUserDto): Promise<UpdateUserDto> {
        await this.userRepository.update(dto, {where: {email}});
        return dto;
    }

    async deleteUser(email: string): Promise<boolean> {
        await this.userRepository.destroy({where: {email}});
        return true;
    }
}
