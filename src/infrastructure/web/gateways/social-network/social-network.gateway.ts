import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../controllers/auth/auth.guards';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { UseCasesProxyUserSocketModule } from '../../../usecases-proxy/user-socket/usecase-proxy-user-socket.module';
import { AddUserSocketUseCases } from '../../../../usecases/user-socket/add-user-socket.usecases';
import { DeleteUserSocketUseCases } from '../../../../usecases/user-socket/delete-user-socket.usecases';
import { UsecasesProxyUserModule } from '../../../usecases-proxy/user/usecases-proxy-user.module';
import { GetUserUseCases } from '../../../../usecases/user/get-user.usecase';
import { UseCasesProxySessionModule } from '../../../usecases-proxy/session/usecase-proxy-session.module';
import { GetSessionUseCases } from '../../../../usecases/session/get-session.usecase';

@UseGuards(AuthGuard)
@WebSocketGateway({ namespace: 'social-network' })
@Injectable()
export class SocialNetworkGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(UsecasesProxyUserModule.GET_USER_USE_CASES_PROXY)
    private readonly getUserUseCaseProxy: UseCaseProxy<GetUserUseCases>,
    @Inject(UseCasesProxySessionModule.GET_SESSION_USE_CASES_PROXY)
    private readonly getSessionUseCaseProxy: UseCaseProxy<GetSessionUseCases>,
    @Inject(UseCasesProxyUserSocketModule.ADD_USER_SOCKET_USE_CASES_PROXY)
    private readonly addUserSocket: UseCaseProxy<AddUserSocketUseCases>,
    @Inject(UseCasesProxyUserSocketModule.DELETE_USER_SOCKET_USE_CASES_PROXY)
    private readonly deleteUserSocket: UseCaseProxy<DeleteUserSocketUseCases>,
  ) {}

  async handleConnection(client: Socket) {
    const bearerToken = client.handshake.headers['authorization'];
    if (bearerToken !== undefined) {
      const token = bearerToken.replace('Bearer ', '');
      const session = await this.getSessionUseCaseProxy
        .getInstance()
        .getSessionByToken(token);
      if (session !== null) {
        const user = await this.getUserUseCaseProxy
          .getInstance()
          .getUserById(session.userId);
        await this.addUserSocket.getInstance().addUserSocket({
          userId: user.id,
          socketId: client.id,
        });
      } else {
        client.disconnect();
      }
    }
  }

  async handleDisconnect(client: Socket) {
    await this.deleteUserSocket.getInstance().deleteUserSocket(client.id);
  }
}
