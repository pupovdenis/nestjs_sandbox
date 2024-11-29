import {Controller, Get} from '@nestjs/common';

@Controller()
export class UserController {

    @Get('kc/admin')
    getAdmin(): string {
        return `hello from admin`;
    }
}
