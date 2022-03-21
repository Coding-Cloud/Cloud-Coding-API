import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { initSwagger } from './infrastructure/swagger/swagger.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  initSwagger(app);
  const port = 3000;
  await app.listen(port);
  Logger.log(`Application listening on port ${port}`);
}

bootstrap();
