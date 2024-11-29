import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {KeycloakService} from './keycloak.service';
import {Roles} from "nest-keycloak-connect";

@Controller('keycloak/users')
export class KeycloakController {
    constructor(private readonly keycloakService: KeycloakService) {
    }

    @Get()
    @Roles({roles: ['my_admin']})
    async getUsers() {
        return this.keycloakService.getUsers();
    }

    @Get(":userId")
    async getUser(@Param("userId") userId: string) {
        return this.keycloakService.getUser(userId);
    }

    @Post()
    async createUserWithRolesAndPassword(@Body() createUserDto: any) {
        const result = await this.keycloakService.createUserWithRolesAndPassword(createUserDto);
        return {message: 'User created successfully with roles and password', userId: result.userId};
    }

    @Delete(':id')
    async deleteUser(@Param('id') userId: string) {
        return this.keycloakService.deleteUser(userId);
    }

    @Post(':id/roles')
    async addRoles(@Param('id') userId: string, @Body() body: { roles: string[] }) {
        return await this.keycloakService.addRolesToUser(userId, body.roles);
    }

    @Delete(':id/roles')
    async deleteRoles(@Param('id') userId: string, @Body() body: { roles: string[] }) {
        return await this.keycloakService.deleteRolesFromUser(userId, body.roles);
    }
}