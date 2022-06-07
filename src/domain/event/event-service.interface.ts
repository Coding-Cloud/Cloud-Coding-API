import { AmqpEventConsumer } from '../../infrastructure/event/interface/amqp-event-consumer.interface';

export interface EventService {
  publish<T>(event: T): void;

  receive<T extends AmqpEventConsumer, E>(event: T): E;
}
