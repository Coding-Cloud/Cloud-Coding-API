import { EventService } from '../../domain/event/event-service.interface';
import { AmqpConfig } from './amqp-config';
import { AmqpConnection } from './amqp-connection';
import { AmqpChannel } from './amqp-channel';
import { AmqpExchange } from './amqp-exchange';

export class AmqpEventService implements EventService {
  private amqpConnection: AmqpConnection;

  constructor(
    private amqpConfig: AmqpConfig,
    private amqpChannel: AmqpChannel,
    private amqpExchange: AmqpExchange,
  ) {
    this.amqpConnection = new AmqpConnection(
      this.amqpConfig.amqpConnectionParam,
    );
    this.initAmqpService();
  }

  publish<T>(event: T): void {}

  receive<T, E>(event: T): E {
    return undefined;
  }

  private async initAmqpService(): Promise<void> {
    await this.amqpConnection.startConnection();
    await this.amqpChannel.startChannel();
    await this.amqpChannel.handleChannelEvents();
    await this.amqpExchange.startExchange();
  }
}
