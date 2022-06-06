import { Options } from 'amqplib';
import { AmqpConnectionParam } from './interface/amqp-connection-param';
import { AmqpConfig } from './amqp-config';

export class AmqpConfigBuilder {
  private queueOptions: Options.AssertQueue;
  private consumeOptions: Options.Consume;
  private amqpConnectionParam: AmqpConnectionParam;
  private reconnectionDelay: number;

  public withQueueOptions(queueOptions: Options.AssertQueue): void {
    this.queueOptions = queueOptions;
  }

  public withConsumeOptions(consumeOptions: Options.Consume): void {
    this.consumeOptions = consumeOptions;
  }

  public withAmqpConnection(amqpConnectionParam: AmqpConnectionParam): void {
    this.amqpConnectionParam = amqpConnectionParam;
  }

  public withReconnectionDelay(reconnectionDelay: number): void {
    this.reconnectionDelay = reconnectionDelay;
  }

  public build(): AmqpConfig {
    if (
      this.queueOptions !== undefined &&
      this.consumeOptions !== undefined &&
      this.amqpConnectionParam !== undefined &&
      this.reconnectionDelay !== undefined
    ) {
      return new AmqpConfig(
        this.queueOptions,
        this.consumeOptions,
        this.amqpConnectionParam,
        this.reconnectionDelay,
      );
    }

    throw new Error("can't build amqp config");
  }
}
