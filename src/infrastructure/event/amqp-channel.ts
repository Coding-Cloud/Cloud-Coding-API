import { AmqpConnection } from './amqp-connection';
import { Channel } from 'amqplib';
import { Logger } from '@nestjs/common';

export class AmqpChannel {
  private _channel: Channel;
  constructor(private connection: AmqpConnection) {}

  async startChannel(): Promise<void> {
    this._channel = await this.connection.connection.createChannel();
  }

  handleChannelEvents(): void {
    this._channel.on('error', (error) => {
      Logger.error('Received channel error', error);
      this.connection.startConnection();
    });

    this.channel.on('close', () => {
      Logger.log('Channel closed');
    });
  }

  get channel(): Channel {
    return this._channel;
  }
}
