import { EventService } from '../../domain/event/event-service.interface';
import { AmqpConfig } from './amqp-config';
import { connect, Connection } from 'amqplib';
import { Logger } from '@nestjs/common';
import { AmqpConnection } from './amqp-connection';

export class AmqpEventService implements EventService {
  private amqpConnection: AmqpConnection;

  constructor(private amqpConfig: AmqpConfig) {
    this.amqpConnection = new AmqpConnection(
      this.amqpConfig.amqpConnectionParam,
    );
  }

  publish<T>(event: T): void {}

  receive<T, E>(event: T): E {
    return undefined;
  }

  private async initAmqpService(): Promise<void> {
    await this.amqpConnection.startConnection();
  }
}
