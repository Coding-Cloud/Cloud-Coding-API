export interface EventService {
  publish<T>(event: T): void;

  receive<T, E>(event: T): E;
}
