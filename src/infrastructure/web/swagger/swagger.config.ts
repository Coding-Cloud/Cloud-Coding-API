import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = (): DocumentBuilder => {
  return new DocumentBuilder()
    .setTitle('cloud coding Swagger')
    .setDescription('un projet plutôt sympa')
    .setVersion('v1.0');
};

export const initSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, swaggerConfig().build());
  SwaggerModule.setup('openapi', app, document);
};
