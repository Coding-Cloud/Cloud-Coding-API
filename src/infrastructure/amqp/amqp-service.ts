import { AmqpChannel } from './amqp-channel';
import { AmqpQueue } from './amqp-queue';
import { AmqpExchange } from './amqp-exchange';
import { Logger } from '@nestjs/common';

export class AmqpService {
  private static instance?: AmqpService;

  private static amqpChannel: AmqpChannel;

  private constructor(amqpChannel: AmqpChannel) {
    AmqpService.amqpChannel = amqpChannel;
  }

  static getInstance(): AmqpService {
    if (!AmqpService.instance) {
      throw new Error('you have to use setAmqpChannel to create AmqpService');
    }
    return this.instance;
  }

  static async setAmqpChannel(amqpChannel: AmqpChannel): Promise<void> {
    this.instance = new AmqpService(amqpChannel);
    await this.amqpChannel.startChannel();
    await this.amqpChannel.handleChannelEvents();
  }

  async addExchange(amqpExchange: AmqpExchange): Promise<void> {
    await AmqpService.amqpChannel.addExchange(amqpExchange);
  }

  addQueue(amqpQueue: AmqpQueue): void {
    AmqpService.amqpChannel.addQueue(amqpQueue);
  }

  sendBroadcastMessage(
    routingKey: string,
    content: string,
    amqpExchangeName: string,
  ): void {
    try {
      AmqpService.amqpChannel.sendBroadcastMessage(
        routingKey,
        content,
        amqpExchangeName,
      );
    } catch (sendBroadcastError) {
      Logger.error('error when sendBroadcast message', sendBroadcastError);
    }
  }

  sendMessageReadOneTime(queueName: string, content: string): void {
    try {
      AmqpService.amqpChannel.sendMessageReadOneTime(queueName, content);
    } catch (sendBroadcastError) {
      Logger.error('error when sendSimpleMessage', sendBroadcastError);
    }
  }

  async startQueuesCreated(): Promise<void> {
    await AmqpService.amqpChannel.startQueues();
  }
}
