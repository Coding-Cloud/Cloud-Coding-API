import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CodeRunnerApi } from '../../../code-runner/code-runner-api.abstract';
import { Inject } from '@nestjs/common';

@WebSocketGateway()
export class ProjectEditionGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(CodeRunnerApi) private readonly codeRunnerApi: CodeRunnerApi,
  ) {}

  handleConnection(client: Socket): void {
    client.rooms.forEach((room) => client.leave(room));
    client.join(client.handshake.query.projectId);
    client.on('disconnecting', () => {
      client.rooms.forEach((room) => {
        if (this.server.sockets.adapter.rooms.get(room).size === 1) {
          console.log('aaa');
          //this.codeRunnerApi.stopCodeRunner(room);
        }
      });
    });
  }

  @SubscribeMessage('rooms')
  getRooms(@ConnectedSocket() client: Socket): WsResponse<string[]> {
    return { data: Array.from(client.rooms), event: 'rooms' };
  }
}
