import { AmqpChannel } from './amqp-channel';
import os from 'os';
import { AmqpConfig } from './amqp-config';
import { Logger } from '@nestjs/common';
import { Message } from 'amqplib';

export class AmqpQueue {
  private queue: string;

  constructor(
    private amqpChannel: AmqpChannel,
    private amqpConfig: AmqpConfig,
  ) {}

  async startQueue(): Promise<void> {
    try {
      const { queue } = await this.amqpChannel.channel.assertQueue(
        AmqpQueue.buildQueueName(),
        this.amqpConfig.queueOptions,
      );
      this.queue = queue;
    } catch (assertQueueError) {
      Logger.error('error when build queue');
      throw assertQueueError;
    }
  }

  async initConsuming(): Promise<void> {
    try {
      await this.amqpChannel.channel.consume(
        this.queue,
        (message) => this.consumeMessage(message),
        this.amqpConfig.consumeOptions,
      );
    } catch (consumeError) {
      Logger.error(`Error when initializing queue consuming`, consumeError);
      throw consumeError;
    }
  }

  private async consumeMessage(message: Message): Promise<void> {
    let data: unknown;
    try {
      data = JSON.parse(message.content.toString());
      this.amqpChannel.channel.ack(message);
    } catch (parseError) {
      Logger.error(
        '(Event bypassed) Error when parsing received event',
        parseError,
      );

      this.amqpChannel.channel.ack(message);
      return;
    }
  }

  private static buildQueueName(): string {
    return `cc-${process.env.NODE_ENV}-${os.hostname()}`;
  }
}
