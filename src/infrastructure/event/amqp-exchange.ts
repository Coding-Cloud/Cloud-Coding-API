import { AmqpConfig } from './amqp-config';
import { AmqpChannel } from './amqp-channel';
import { Logger } from '@nestjs/common';

export class AmqpExchange {
  constructor(
    private amqpConfig: AmqpConfig,
    private amqpChannel: AmqpChannel,
    private exchangeMode: string,
  ) {}

  async startExchange(): Promise<void> {
    try {
      await this.amqpChannel.channel.assertExchange(
        this.amqpConfig.amqpConnectionParam.exchange,
        this.exchangeMode,
      );
    } catch (assertExchangeError) {
      Logger.error(`Error when start exchange`);
      throw assertExchangeError;
    }
  }

  async addQueue(queue: string): Promise<void> {
    try {
      await this.amqpChannel.channel.bindQueue(
        queue,
        this.amqpConfig.amqpConnectionParam.exchange,
        '',
      );
    } catch (bindQueueError) {
      Logger.error(`Error when binding queue to exchnage`);
      throw bindQueueError;
    }
  }
}
