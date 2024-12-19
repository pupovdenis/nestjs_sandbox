import {Body, Controller, Delete, Get, HttpCode, Param, Post, Req} from '@nestjs/common';
import {KeycloakService} from './keycloak.service';
import {Roles, Unprotected} from "nest-keycloak-connect";

@Controller('keycloak/users')
export class KeycloakController {
    constructor(private readonly keycloakService: KeycloakService) {
    }

    @Post('introspect')
    @Unprotected()
    // @Roles({roles: ['my_admin']}) //or
    @HttpCode(200)
    async introspectToken(@Req() req: any, @Body('token') token: string) {
        try {
            const introspection = await this.keycloakService.introspectToken(token);

            const user = req.user;
            const accessToken = req.accessToken;
            const user_resource_roles = Object.values(user?.resource_access || {})
                .flatMap((resource: any) => resource.roles || []);

            return {
                user_preferred_username: user?.preferred_username || "undefined",
                user_realm_roles: user?.realm_access.roles || [],
                user_resource_roles: user_resource_roles,
                token: accessToken,
                introspection_active: introspection?.active,
                introspection_username: introspection?.username,
                introspection_client_id: introspection?.client_id
            };
        } catch (error) {
            console.error('Error introspecting token', error.response?.data || error.message);
            throw error;
        }
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