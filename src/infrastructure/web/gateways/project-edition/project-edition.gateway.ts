import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { UseCasesProxyProjectEditionModule } from '../../../usecases-proxy/project-edition/use-cases-proxy-project-edition.module';
import { StopProjectRunnerUseCase } from '../../../../usecases/project-edition/stop-project-runner.usecase';
import { StartProjectRunnerUseCase } from '../../../../usecases/project-edition/start-project-runner.usecase';
import { EditProjectDTO2 } from './dto/edit-project.dto';
import { EditProjectRunnerUseCase } from 'src/usecases/project-edition/edit-project-runner.usecase';

@WebSocketGateway()
export class ProjectEditionGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(
      UseCasesProxyProjectEditionModule.START_PROJECT_RUNNER_USE_CASES_PROXY,
    )
    private readonly startProject: UseCaseProxy<StartProjectRunnerUseCase>,
    @Inject(
      UseCasesProxyProjectEditionModule.STOP_PROJECT_RUNNER_USE_CASES_PROXY,
    )
    private readonly stopProject: UseCaseProxy<StopProjectRunnerUseCase>,
    @Inject(
      UseCasesProxyProjectEditionModule.EDIT_PROJECT_RUNNER_USE_CASES_PROXY,
    )
    private readonly editProject: UseCaseProxy<EditProjectRunnerUseCase>,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const projectId = client.handshake.query.projectId as string;
      client.rooms.forEach((room) => client.leave(room));
      client.join(projectId);
      //await this.startProject.getInstance().startProjectRunner(projectId);

      client.on('disconnecting', () => {
        client.rooms.forEach(async (room) => {
          if (this.server.sockets.adapter.rooms.get(room).size === 1) {
            //await this.stopProject.getInstance().stopProjectRunner(projectId);
          }
        });
      });
    } catch (error) {
      Logger.error(error);
      client.disconnect();
    }
  }

  @SubscribeMessage('rooms')
  getRooms(@ConnectedSocket() client: Socket): WsResponse<string[]> {
    return { data: Array.from(client.rooms), event: 'rooms' };
  }

  @SubscribeMessage('editProject')
  async editProjectEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody('project') editsProjectDTO: EditProjectDTO2[],
  ): Promise<void> {
    const editsProject = editsProjectDTO.map((editProjectDTO) => ({
      ...editProjectDTO,
    }));
    console.log(editsProject);
    await this.editProject.getInstance().editProject(editsProject);
  }
}
