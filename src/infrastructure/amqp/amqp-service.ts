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

  async addQueue(
    amqpQueue: AmqpQueue,
    amqpExchangeName?: string,
  ): Promise<void> {
    await AmqpService.amqpChannel.addQueue(amqpQueue, amqpExchangeName);
    Logger.log('on set une queue');
  }

  sendBroadcastMessage(
    routingKey: string,
    amqpExchangeName: string,
    content: string,
  ): void {
    console.log(amqpExchangeName);
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
}
