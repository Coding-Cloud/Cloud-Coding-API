import { Options } from 'amqplib';
import { AmqpConnectionParam } from './interface/amqp-connection-param';

export class AmqpConfig {
  constructor(
    private _queueOptions: Options.AssertQueue,
    private _consumeOptions: Options.Consume,
    private _amqpConnectionParam: AmqpConnectionParam,
    private _reconnectionDelay: number,
  ) {}

  get queueOptions(): Options.AssertQueue {
    return this._queueOptions;
  }

  get consumeOptions(): Options.Consume {
    return this._consumeOptions;
  }

  get amqpConnectionParam(): AmqpConnectionParam {
    return this._amqpConnectionParam;
  }

  get reconnectionDelay(): number {
    return this._reconnectionDelay;
  }
}
