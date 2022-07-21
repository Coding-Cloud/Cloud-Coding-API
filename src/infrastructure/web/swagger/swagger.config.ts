import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = (): DocumentBuilder => {
  return new DocumentBuilder()
    .setTitle('cloud coding Swagger')
    .setDescription('un projet plutôt sympa')
    .setVersion('v1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'auth-token',
    );
};

export const initSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, swaggerConfig().build());
  SwaggerModule.setup('openapi', app, document);
};
