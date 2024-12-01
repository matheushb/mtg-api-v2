import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './common/config/app-config';
import swaggerConfig from './common/config/swagger-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appConfig(app);
  swaggerConfig(app);

  const config = app.get(ConfigService);

  await app.startAllMicroservices();
  await app.listen(config.get('PORT'));
}
bootstrap();
