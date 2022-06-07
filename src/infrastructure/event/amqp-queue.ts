import { Options } from 'amqplib';

export class AmqpQueue {
  private readonly _queue: string;

  constructor(
    queue: string,
    private _routingKey: string,
    private _queueOptions: Options.AssertQueue,
    private _consumeOptions: Options.Consume,
  ) {
    this._queue = AmqpQueue.buildQueueName(queue);
  }

  private static buildQueueName(queue: string): string {
    return ``;
  }

  get queue(): string {
    return this._queue;
  }

  get routingKey(): string {
    return this._routingKey;
  }

  get queueOptions(): Options.AssertQueue {
    return this._queueOptions;
  }

  get consumeOptions(): Options.Consume {
    return this._consumeOptions;
  }
}
