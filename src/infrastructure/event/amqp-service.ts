import { AmqpChannel } from './amqp-channel';
import { AmqpQueue } from './amqp-queue';

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

  async addQueue(amqpQueue: AmqpQueue): Promise<void> {
    await AmqpService.amqpChannel.addQueue(amqpQueue);
    console.log('on set une queue');
  }
}
