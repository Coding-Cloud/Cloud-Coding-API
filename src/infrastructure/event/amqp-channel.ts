import { AmqpConnection } from './amqp-connection';
import { Channel, Message } from 'amqplib';
import { Logger } from '@nestjs/common';
import { AmqpExchange } from './amqp-exchange';
import { AmqpQueue } from './amqp-queue';

export class AmqpChannel {
  private _channel: Channel;
  constructor(
    private connection: AmqpConnection,
    private amqpExchanges: Map<string, AmqpExchange> = new Map(),
  ) {}

  async startChannel(): Promise<void> {
    await this.connection.startConnection();
    this.connection.handleConnectionEvents();
    this._channel = await this.connection.connection.createChannel();
    this.createExchanges();
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

  private async consumeMessage<E>(
    message: Message,
    amqpQueue: AmqpQueue,
  ): Promise<E> {
    try {
      const data = JSON.parse(message.content.toString());
      console.log(data);
      console.log(message.content.toString());
      amqpQueue.callBack(data.room);
      this._channel.ack(message);
      //return data;
    } catch (parseError) {
      Logger.error(
        '(Event bypassed) Error when parsing received event',
        parseError,
      );

      this._channel.ack(message);
      return;
    }
  }

  private createExchanges(): void {
    Object.values(this.amqpExchanges).forEach((exchange: AmqpExchange) => {
      try {
        this._channel.assertExchange(
          exchange.exchangeName,
          exchange.exchangeMode,
        );
      } catch (assertExchangeError) {
        Logger.error(`Error when start exchange`);
        throw assertExchangeError;
      }
    });
  }

  async addExchange(amqpExchange: AmqpExchange): Promise<void> {
    this.amqpExchanges.set(amqpExchange.exchangeName, amqpExchange);
    try {
      await this._channel.assertExchange(
        amqpExchange.exchangeName,
        amqpExchange.exchangeMode,
      );
    } catch (assertExchangeError) {
      Logger.error(`Error when start exchange`);
      throw assertExchangeError;
    }
  }

  async addQueue(amqpQueue: AmqpQueue, amqpExchange: string) {
    try {
      await this._channel.assertQueue(amqpQueue.queue, amqpQueue.queueOptions);
      await this.consumeQueue(amqpQueue);
    } catch (assertQueueError) {
      Logger.error('error when build queue');
      throw assertQueueError;
    }

    try {
      await this._channel.bindQueue(
        amqpQueue.queue,
        this.amqpExchanges.get(amqpExchange).exchangeName,
        amqpQueue.routingKey,
      );
    } catch (bindQueueError) {
      Logger.error(`Error when binding queue to exchange`);
      throw bindQueueError;
    }
  }

  sendBroadcastMessage(
    routingKey: string,
    amqpExchangeName: string,
    content: string,
  ) {
    console.log("on essaie bien d'envoyer");
    this._channel.publish(amqpExchangeName, routingKey, Buffer.from(content));
  }

  private async consumeQueue(amqpQueue: AmqpQueue) {
    try {
      await this._channel.consume(
        amqpQueue.queue,
        (message) => this.consumeMessage<void>(message, amqpQueue),
        amqpQueue.consumeOptions,
      );
      return;
    } catch (consumeError) {
      Logger.error(`Error when initializing queue consuming`, consumeError);
      throw consumeError;
    }
  }

  get channel(): Channel {
    return this._channel;
  }
}
