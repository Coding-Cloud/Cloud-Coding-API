import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { initSwagger } from './infrastructure/web/swagger/swagger.config';
import { AmqpQueue } from './infrastructure/event/amqp-queue';
import { AmqpExchange } from './infrastructure/event/amqp-exchange';
import { AmqpChannel } from './infrastructure/event/amqp-channel';
import { AmqpConnection } from './infrastructure/event/amqp-connection';
import { AmqpService } from './infrastructure/event/amqp-service';
import { AmqpConfigBuilder } from './infrastructure/event/amqp-config-builder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: '*' });
  initSwagger(app);
  const port = 3000;
  await app.listen(port);
  Logger.log(`Application listening on port ${port}`);

  const amqpConnection = new AmqpConnection({
    user: 'guest',
    password: '****',
    port: '5672',
    host: 'localhost',
  });
  const amqpExchange = new AmqpExchange('direct', 'messages');
  const amqpQueue = new AmqpQueue(
    '',
    'addSocket',
    {
      exclusive: true,
      durable: true,
    },
    {
      noAck: false,
    },
  );

  const amqpQueue2 = new AmqpQueue(
    '',
    'addSocket',
    {
      exclusive: true,
      durable: true,
    },
    {
      noAck: false,
    },
  );
  const amqpConfig = new AmqpConfigBuilder()
    .withAmqpConnectionParam({
      user: 'test',
      password: 'test',
      port: '5672',
      host: 'localhost',
    })
    .withReconnectionDelay(10_000);

  const amqpChannel = new AmqpChannel(amqpConnection, amqpExchange);

  await AmqpService.setAmqpChannel(amqpChannel);
  await AmqpService.getInstance().addQueue(amqpQueue);
  await AmqpService.getInstance().addQueue(amqpQueue2);
}

bootstrap();
