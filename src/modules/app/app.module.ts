import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from '../user/user.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import configurations from "../../configurations";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../user/models/user.model";
import {WatchlistModule} from "../watchlist/watchlist.module";
import {Watchlist} from "../watchlist/models/watchlist.model";
import {AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard} from "nest-keycloak-connect";
import {APP_GUARD} from "@nestjs/core";

@Module({
    imports: [
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
    controllers: [AppController],
    providers: [
        AppService,

        //Это добавляет защиту аутентификации на глобальном уровне, вы также можете ограничить ее область действия, если хотите.
        //Возвращает ошибку 401 «не авторизовано», если не удается проверить токен JWT или отсутствует заголовок Bearer.
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        //Это добавляет глобальный уровень ресурсной защиты.
        //Только контроллеры, аннотированные @Resource, и методы с @Scopes обрабатываются этой защитой.
        {
            provide: APP_GUARD,
            useClass: ResourceGuard,
        },
        //Это добавляет глобальный уровень ролевой защиты.
        //Используется декоратором `@Roles` с необязательным декоратором `@AllowAnyRole` для разрешения любой указанной переданной роли.
        {
            provide: APP_GUARD,
            useClass: RoleGuard,
        },
    ],
})
export class AppModule {
}
