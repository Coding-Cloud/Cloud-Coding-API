import { AmqpConnectionParam } from './interface/amqp-connection-param';
import { Logger } from '@nestjs/common';
import { connect, Connection } from 'amqplib';

export class AmqpConnection {
  private readonly baseConnectionPath;
  private _connection: Connection;

  constructor(private amqpConnectionParam: AmqpConnectionParam) {
    this.baseConnectionPath = `amqp://${this.amqpConnectionParam.user}:${this.amqpConnectionParam.password}@${this.amqpConnectionParam.host}:${this.amqpConnectionParam.port}`;
  }

  async startConnection(): Promise<void> {
    try {
      this._connection = await connect(this.baseConnectionPath);
    } catch (connectError) {
      Logger.error(
        `Error when trying to connect to AMQP ${this.baseConnectionPath}`,
        connectError,
      );
      throw connectError;
    }
  }

  handleConnectionEvents(): void {
    this._connection.on('error', (connectionError) => {
      Logger.error(`Receiving AMQP connection error`, connectionError);
      this.startConnection();
    });

    this.connection.on('close', () => {
      Logger.log(`AMQP connection closed`);
    });
  }

  get connection(): Connection {
    return this._connection;
  }
}
