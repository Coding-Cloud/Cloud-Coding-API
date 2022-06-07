import { EventService } from '../../domain/event/event-service.interface';
import { AmqpEventConsumer } from './interface/amqp-event-consumer.interface';

/*export class AmqpEventService implements EventService {
  publish<T>(event: T): void {}

  receive<T extends AmqpEventConsumer, E>(event: T): E {
    return event.consume<E>();
  }
}*/
