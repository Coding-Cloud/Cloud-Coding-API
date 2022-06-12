import { AmqpConnection } from './amqp-connection';
import { Channel, Message } from 'amqplib';
import { Logger } from '@nestjs/common';
import { AmqpExchange } from './amqp-exchange';
import { AmqpQueue } from './amqp-queue';
import { log } from "util";

export class AmqpChannel {
  private _channel: Channel;
  constructor(
    private connection: AmqpConnection,
    private amqpExchanges: Map<string, AmqpExchange> = new Map(),
    private amqpQueuesToCreate: AmqpQueue[] = [],
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

  private async consumeMessage(
    message: Message,
    amqpQueue: AmqpQueue,
  ): Promise<void> {
    try {
      const data = JSON.parse(message.content.toString());
      console.log(data);
      console.log(message.fields);
      console.log(amqpQueue.callBack);
      //amqpQueue.callBack(data);
      this._channel.ack(message);
    } catch (parseError) {
      Logger.error(
        '(Event bypassed) Error when parsing received amqp consumeMessage',
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

  addQueue(amqpQueue: AmqpQueue) {
    this.amqpQueuesToCreate.push(amqpQueue);
  }

  async startQueues(): Promise<void> {
    console.log('je suis avant le for');
    for (const queue of this.amqpQueuesToCreate) {
      console.log('on set une queue ');
      console.log(queue.queue);
      try {
        await this._channel.assertQueue(queue.queue, queue.queueOptions);
        await this.consumeQueue(queue);
      } catch (assertQueueError) {
        Logger.error('error when build queue');
        throw assertQueueError;
      }

      if (!this.amqpExchanges.get(queue.exchangeName)) return;

      try {
        await this._channel.bindQueue(
          queue.queue,
          this.amqpExchanges.get(queue.exchangeName).exchangeName,
          queue.routingKey,
        );
      } catch (bindQueueError) {
        Logger.error(`Error when binding queue to exchange`);
        throw bindQueueError;
      }
    }
    this.amqpQueuesToCreate.pop();
  }

  sendBroadcastMessage(
    routingKey: string,
    content: string,
    amqpExchangeName: string,
  ) {
    this._channel.publish(amqpExchangeName, routingKey, Buffer.from(content));
  }

  sendMessageReadOneTime(queueName: string, content: string) {
    this._channel.sendToQueue(queueName, Buffer.from(content));
  }

  private async consumeQueue(amqpQueue: AmqpQueue) {
    try {
      await this._channel.consume(
        amqpQueue.queue,
        (message) => this.consumeMessage(message, amqpQueue),
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
