import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CodeRunnerApi } from '../../../code-runner/code-runner-api.abstract';
import { Inject } from '@nestjs/common';

@WebSocketGateway()
export class ProjectEditionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(CodeRunnerApi) private readonly codeRunnerApi: CodeRunnerApi,
  ) {}

  handleConnection(client: Socket, ...args: any[]): any {
    console.log(args);
    client.join('');
  }

  @SubscribeMessage('rooms')
  findAll(@ConnectedSocket() client: Socket): Set<string> {
    return client.rooms;
  }

  handleDisconnect(client: Socket): void {
    client.rooms.forEach((room) => {
      if (room.length === 1) {
        this.codeRunnerApi.stopCodeRunner(room);
      }
    });
    client.disconnect();
  }
}
