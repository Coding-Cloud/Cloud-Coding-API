import { Options } from 'amqplib';
import { AmqpConnectionParam } from './interface/amqp-connection-param';

export class AmqpConfig {
  constructor(
    private _amqpConnectionParam: AmqpConnectionParam,
    private _reconnectionDelay: number,
  ) {}

  get amqpConnectionParam(): AmqpConnectionParam {
    return this._amqpConnectionParam;
  }

  get reconnectionDelay(): number {
    return this._reconnectionDelay;
  }
}
