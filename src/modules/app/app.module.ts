import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {UserModule} from '../user/user.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import configurations from "../../configurations";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../user/models/user.model";
import {WatchlistModule} from "../watchlist/watchlist.module";
import {Watchlist} from "../watchlist/models/watchlist.model";
import {KeycloakModule} from "../keycloak/keycloak.module";
import {AppService} from "./app.service";

@Module({
    imports: [
        KeycloakModule,
        UserModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configurations]
        }),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                dialect: "postgres",
                host: configService.get('db_host'),
                port: configService.get('db_port'),
                name: configService.get('db_name'),
                username: configService.get('db_user'),
                password: configService.get('db_password'),
                synchronize: true,
                autoLoadModels: true,
                models: [User, Watchlist]
            })
        }),
        WatchlistModule,

    ],
    providers: [AppService],
    controllers: [AppController],
})
export class AppModule {
}
