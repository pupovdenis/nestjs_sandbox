import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from "@nestjs/config";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  const swaggerConfig = new DocumentBuilder()
      .setTitle("Title")
      .setDescription("Description")
      .setVersion("1.0")
      .addTag("API")
      .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, swaggerDocument);

  await app.listen(port);
}
bootstrap();
