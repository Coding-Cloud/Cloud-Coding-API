import { AmqpConnection } from './amqp-connection';
import { Channel } from 'amqplib';

export class AmqpChannel {
  private _channel: Channel;
  constructor(private connection: AmqpConnection) {}

  async startChannel(): Promise<void> {
    this._channel = await this.connection.connection.createChannel();
  }

  get channel(): Channel {
    return this._channel;
  }
}
