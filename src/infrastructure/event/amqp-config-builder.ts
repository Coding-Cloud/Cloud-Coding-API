import { Options } from 'amqplib';
import { AmqpConnectionParam } from './interface/amqp-connection-param';
import { AmqpConfig } from './amqp-config';

export class AmqpConfigBuilder {
  private amqpConnectionParam: AmqpConnectionParam;
  private reconnectionDelay: number;

  public withAmqpConnectionParam(
    amqpConnectionParam: AmqpConnectionParam,
  ): AmqpConfigBuilder {
    this.amqpConnectionParam = amqpConnectionParam;
    return this;
  }

  public withReconnectionDelay(reconnectionDelay: number): AmqpConfigBuilder {
    this.reconnectionDelay = reconnectionDelay;
    return this;
  }

  public build(): AmqpConfig {
    if (
      this.amqpConnectionParam !== undefined &&
      this.reconnectionDelay !== undefined
    ) {
      return new AmqpConfig(this.amqpConnectionParam, this.reconnectionDelay);
    }

    throw new Error("can't build amqp config");
  }
}
