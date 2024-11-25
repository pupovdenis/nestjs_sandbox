import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import * as bcrypt from "bcrypt";
import {CreateUserDto, UpdateUserDto} from "./dto";
import {Watchlist} from "../watchlist/models/watchlist.model";

@Injectable()
export class UserService {

    constructor(@InjectModel(User) private readonly userRepository: typeof User) {
    }

    async encrypt(password): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async getPublicUser(email: string): Promise<User> {
        return await this.userRepository.findOne({
            rejectOnEmpty: undefined,
            where: {email},
            attributes: {exclude: ["password"]},
            include: {
                model: Watchlist,
                required: false
            }
        });
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

    async findUserByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({rejectOnEmpty: undefined, where: {email: email}});
    }

    async updateUser(id: number, dto: UpdateUserDto): Promise<UpdateUserDto> {
        await this.userRepository.update({dto}, {where: {id}});
        return dto;
    }

    async deleteUser(email: string): Promise<boolean> {
        await this.userRepository.destroy({where: {email}});
        return true;
    }
}
