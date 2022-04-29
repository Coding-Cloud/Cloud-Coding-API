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
import { EditProjectDTO } from './dto/edit-project.dto';
import { EditProjectRunnerUseCase } from 'src/usecases/project-edition/edit-project-runner.usecase';
import { RenameFolderDTO } from './dto/rename-folder-dto';
import { EditProject } from 'src/usecases/project-edition/types/edit-project';
import { RenameFolder } from 'src/usecases/project-edition/types/rename-folder';
import { RenameProjectRunnerUseCase } from 'src/usecases/project-edition/rename-project-folder-runner.usecase';
import { RenameFolderResource } from './resource/rename-folder-resource';
import { DeleteProjectFolderRunnerUseCase } from 'src/usecases/project-edition/delete-project-folder.usecase';
import { DeleteFolder } from 'src/usecases/project-edition/types/delete-folder';
import { DeleteFolderDTO } from './dto/delete-folder.dto';
import { DeleteFolderResource } from './resource/delete-folder.dto';
import * as chokidar from 'chokidar';
import * as fs from 'fs/promises';

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
    @Inject(
      UseCasesProxyProjectEditionModule.RENAME_FOLDER_PROJECT_RUNNER_USE_CASES_PROXY,
    )
    private readonly renameFolderProject: UseCaseProxy<RenameProjectRunnerUseCase>,
    @Inject(
      UseCasesProxyProjectEditionModule.DELETE_FOLDER_PROJECT_RUNNER_USE_CASES_PROXY,
    )
    private readonly deleteFolderProject: UseCaseProxy<DeleteProjectFolderRunnerUseCase>,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const projectId = client.handshake.query.projectId as string;
      client.join(projectId);
      await this.startProject.getInstance().startProjectRunner(projectId);
      const watcher = chokidar.watch(
        [`${process.env.LOG_PATH_PROJECT}/${projectId}`],
        {
          persistent: true,
        },
      );

      // Add event listeners.
      watcher.on('change', async () => {
        const contentLogFile = await fs.readFile(
          `${process.env.LOG_PATH_PROJECT}/${projectId}.log`,
          { encoding: 'utf-8' },
        );
        client.emit('logChanged', contentLogFile);
      });

      client.on('disconnecting', () => {
        client.rooms.forEach(async (room) => {
          if (this.server.sockets.adapter.rooms.get(room).size === 1) {
            await this.stopProject.getInstance().stopProjectRunner(projectId);
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
    @MessageBody('project') editsProjectDTO: EditProjectDTO[],
  ): Promise<void> {
    const editsProject: EditProject[] = editsProjectDTO.map(
      (editProjectDTO) => ({
        ...editProjectDTO,
      }),
    );
    await this.editProject.getInstance().editProject(editsProject);
    this.broadcastEditProject(
      'projectModificationFromContributor',
      editsProject,
      client,
    );
  }

  @SubscribeMessage('renameFolder')
  async renameFolderEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() renameFolderDTO: RenameFolderDTO,
  ): Promise<void> {
    const basePath = `${process.env.BASE_PATH_PROJECT}/`;

    const renameFolder: RenameFolder = { ...renameFolderDTO };
    await this.renameFolderProject
      .getInstance()
      .renameProjectFolder(renameFolder);
    this.broadcastRenameProject(
      'renameProjectFolder',
      { ...renameFolder, basePath },
      client,
    );
  }

  @SubscribeMessage('deleteFolder')
  async deleteFolderEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() deleteFolderDTO: DeleteFolderDTO,
  ): Promise<void> {
    const basePath = `${process.env.BASE_PATH_PROJECT}/`;

    const deleteFolder: DeleteFolder = { ...deleteFolderDTO };
    await this.deleteFolderProject
      .getInstance()
      .deleteProjectFolder(deleteFolder);
    this.broadcastDeleteFolderProject(
      'deleteProjectFolder',
      { ...deleteFolder, basePath },
      client,
    );
  }

  private broadcastEditProject(
    event: string,
    editProjectDTO: EditProjectDTO[],
    client: Socket,
  ) {
    //2 rooms ici
    client.rooms.forEach(async (room) => {
      client.broadcast.to(room).emit(event, editProjectDTO);
    });
  }

  private broadcastRenameProject(
    event: string,
    renameFolderResource: RenameFolderResource,
    client: Socket,
  ) {
    client.rooms.forEach(async (room) => {
      client.broadcast.to(room).emit(event, renameFolderResource);
    });
  }

  private broadcastDeleteFolderProject(
    event: string,
    deleteFolderResource: DeleteFolderResource,
    client: Socket,
  ) {
    client.rooms.forEach(async (room) => {
      client.broadcast.to(room).emit(event, deleteFolderResource);
    });
  }
}
