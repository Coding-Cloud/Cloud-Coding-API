import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { initSwagger } from './infrastructure/web/swagger/swagger.config';
import { AmqpChannel } from './infrastructure/event/amqp-channel';
import { AmqpConnection } from './infrastructure/event/amqp-connection';
import { AmqpService } from './infrastructure/event/amqp-service';
import { AmqpConfigBuilder } from './infrastructure/event/amqp-config-builder';

async function bootstrap() {
  const amqpConfig = new AmqpConfigBuilder()
    .withAmqpConnectionParam({
      user: process.env.AMQP_USER,
      password: process.env.AMQP_PASSWORD,
      port: process.env.AMQP_PORT,
      host: process.env.AMQP_HOST,
    })
    .withReconnectionDelay(10_000)
    .build();
  const amqpConnection = new AmqpConnection(amqpConfig.amqpConnectionParam);
  const amqpChannel = new AmqpChannel(amqpConnection);
  await AmqpService.setAmqpChannel(amqpChannel);

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: '*' });
  initSwagger(app);
  const port = 3000;
  await app.listen(port);
  Logger.log(`Application listening on port ${port}`);
}

bootstrap();
