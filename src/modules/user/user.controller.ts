import {Controller, Get} from '@nestjs/common';
import {Public, Roles, Unprotected} from "nest-keycloak-connect";

@Controller()
export class UserController {

    @Get('kc/unprotected')
    @Unprotected()
    getNoGuard(): string {
        return `hello from no guard`;
    }

    @Get('kc/user')
    @Roles({roles: ['my_user']})
    getUser(): string {
        return `hello from user`;
    }

    @Get('kc/admin')
    @Roles({roles: ['my_admin']})
    getAdmin(): string {
        return `hello from admin`;
    }

    @Get('kc/all')
    getAll(): string {
        return `hello from authenticated`;
    }

    @Get('kc/public')
    @Public()
    getPublic(): string {
        return `hello from public`;
    }
}
