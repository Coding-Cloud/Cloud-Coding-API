import { AmqpConnection } from './amqp-connection';
import { Channel, Message } from 'amqplib';
import { Logger } from '@nestjs/common';
import { AmqpExchange } from './amqp-exchange';
import { AmqpEventConsumer } from './interface/amqp-event-consumer.interface';
import { AmqpQueue } from './amqp-queue';
import { AmqpConfig } from './amqp-config';

export class AmqpChannel implements AmqpEventConsumer {
  private _channel: Channel;
  constructor(
    private connection: AmqpConnection,
    private amqpExchange: AmqpExchange,
  ) {}

  async startChannel(): Promise<void> {
    await this.connection.startConnection();
    this._channel = await this.connection.connection.createChannel();
    //this.handleChannelEvents();x
    await this.createExchange();
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

  async consume<E>(): Promise<E> {
    /*await this.startChannel();
    try {
      await this._channel.consume(
        this.amqpQueue.queue,
        (message) => this.consumeMessage<E>(message),
        this.amqpQueue.consumeOptions,
      );
      return;
    } catch (consumeError) {
      Logger.error(`Error when initializing queue consuming`, consumeError);
      throw consumeError;
    }*/
    return;
  }

  private async consumeMessage<E>(message: Message): Promise<E> {
    try {
      //const data = JSON.parse(message.fields);
      console.log(message);
      console.log(message.content.toString());
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

  private async createExchange(): Promise<void> {
    try {
      await this._channel.assertExchange(
        this.amqpExchange.exchangeName,
        this.amqpExchange.exchangeMode,
      );
    } catch (assertExchangeError) {
      Logger.error(`Error when start exchange`);
      throw assertExchangeError;
    }
  }

  private async bindQueueToExchange(): Promise<void> {
    /*try {
      await this._channel.bindQueue(
        this.amqpQueue.queue,
        this.amqpExchange.exchangeName,
        this.amqpQueue.routingKey,
      );
    } catch (bindQueueError) {
      Logger.error(`Error when binding queue to exchange`);
      throw bindQueueError;
    }*/
  }

  async addQueue(amqpQueue: AmqpQueue) {
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
        this.amqpExchange.exchangeName,
        amqpQueue.routingKey,
      );
    } catch (bindQueueError) {
      Logger.error(`Error when binding queue to exchange`);
      throw bindQueueError;
    }
  }

  private async consumeQueue(amqpQueue: AmqpQueue) {
    try {
      await this._channel.consume(
        amqpQueue.queue,
        (message) => this.consumeMessage<void>(message),
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
