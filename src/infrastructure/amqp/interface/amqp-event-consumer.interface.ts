export interface AmqpEventConsumer {
  consume<E>(): Promise<E>;
}
