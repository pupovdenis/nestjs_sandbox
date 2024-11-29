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
import {AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard} from "nest-keycloak-connect";
import {APP_GUARD} from "@nestjs/core";

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
        KeycloakConnectModule.register({
            authServerUrl: 'http://localhost:8080',
            realm: 'geofocus-realm',
            clientId: 'nest-app',
            secret: 'mVYcnM4eZ99mWiFAjnXil8CZFcyOOwMc',
        }),
    ],
    providers: [AppService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: ResourceGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RoleGuard,
        },
    ],
    controllers: [AppController],
})
export class AppModule {
}
