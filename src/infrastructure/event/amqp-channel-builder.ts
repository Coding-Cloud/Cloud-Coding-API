import { Options } from "amqplib";
import { AmqpConnectionParam } from "./interface/amqp-connection-param";

export class AmqpChannelBuilder {
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
}
