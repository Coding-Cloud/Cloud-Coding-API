import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { initSwagger } from './infrastructure/web/swagger/swagger.config';
import { AmqpChannel } from './infrastructure/amqp/amqp-channel';
import { AmqpConnection } from './infrastructure/amqp/amqp-connection';
import { AmqpService } from './infrastructure/amqp/amqp-service';
import { AmqpConfigBuilder } from './infrastructure/amqp/amqp-config-builder';
import { AmqpExchange } from './infrastructure/amqp/amqp-exchange';

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
  const amqpExchange = new AmqpExchange('direct', 'globalExchange');
  await AmqpService.getInstance().addExchange(amqpExchange);

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: '*' });
  initSwagger(app);
  const port = 3000;
  await app.listen(process.env.SERVER_PORT || port);
  Logger.log(`Application listening on port ${port}`);
  await AmqpService.getInstance().startQueuesCreated();
}

bootstrap();
