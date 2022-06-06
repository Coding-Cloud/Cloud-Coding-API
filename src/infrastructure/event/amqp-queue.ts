import { AmqpChannel } from './amqp-channel';
import os from 'os';
import { AmqpConfig } from './amqp-config';
import { Logger } from '@nestjs/common';

export class AmqpQueue {
  private queue: string;

  constructor(
    private amqpExchange: AmqpChannel,
    private amqpConfig: AmqpConfig,
  ) {}

  async startQueue(): Promise<void> {
    try {
      const { queue } = await this.amqpExchange.channel.assertQueue(
        AmqpQueue.buildQueueName(),
        this.amqpConfig.queueOptions,
      );
      this.queue = queue;
    } catch (assertQueueError) {
      Logger.error('error when build queue');
      throw assertQueueError;
    }
  }

  private static buildQueueName(): string {
    return `cc-${process.env.NODE_ENV}-${os.hostname()}`;
  }
}
