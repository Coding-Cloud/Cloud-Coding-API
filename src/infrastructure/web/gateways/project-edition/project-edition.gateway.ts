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
import { Inject, Injectable, Logger } from '@nestjs/common';
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
import {
  addDisconnectigProjectTimeout,
  deleteDisconnectigProjectTimeout,
} from './ram-disconnecting-project/disconnecting-project-timeout';
import { HttpService } from '@nestjs/axios';
import { CreateImageUseCase } from '../../../../usecases/project-edition/create-image.usecase';
import { FolderStatus } from 'src/domain/folder/folder-status.enum';
import {
  addConnectedUsers,
  deleteConnectedUsers,
  getConnectedUsers,
} from './ram-connected-users/connected-users';
import { AmqpService } from '../../../event/amqp-service';
import { AmqpExchange } from '../../../event/amqp-exchange';
import { AmqpQueue } from '../../../event/amqp-queue';

@WebSocketGateway()
@Injectable()
export class ProjectEditionGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private httpService: HttpService,
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
    @Inject(UseCasesProxyProjectEditionModule.CREATE_IMAGE_USE_CASES_PROXY)
    private readonly createImage: UseCaseProxy<CreateImageUseCase>,
  ) {
    this.initAmqpCodeRunner();
  }

  async initAmqpCodeRunner(): Promise<void> {
    const amqpExchange = new AmqpExchange('direct', 'messages');
    const amqpQueue = new AmqpQueue(
      '',
      'sendUser',
      {
        exclusive: true,
        durable: true,
      },
      {
        noAck: false,
      },
      this.sendUserInRoom.bind(this),
    );

    await AmqpService.getInstance().addExchange(amqpExchange);
    await AmqpService.getInstance().addQueue(amqpQueue, 'messages');
  }
  //TODO: refactoring all the connexion system with specific usecase
  async handleConnection(client: Socket): Promise<void> {
    try {
      const projectId = client.handshake.query.projectId as string;
      const username = client.handshake.query.username as string;
      client.join(projectId);
      addConnectedUsers(projectId, username);
      client.data.username = username;
      this.checkCodeRunnerStatus(projectId, client);
      deleteDisconnectigProjectTimeout(projectId);

      await this.startProject.getInstance().startProjectRunner(projectId);
      const watcher = chokidar.watch(
        [`${process.env.LOG_PATH_PROJECT}/${projectId}`],
        {
          persistent: true,
          usePolling: true,
          interval: 2000,
        },
      );

      // Add event listeners.
      /*watcher.on('change', async () => {
        const contentLogFile = await fs.readFile(
          `${process.env.LOG_PATH_PROJECT}/${projectId}.log`,
          { encoding: 'utf-8' },
        );
        client.emit('logChanged', contentLogFile);
      });*/

      client.on('disconnecting', () => {
        client.rooms.forEach(async (room) => {
          if (this.server.sockets.adapter.rooms.get(room).size === 1) {
            if (getConnectedUsers(room)) {
              const timeOut = setTimeout(async () => {
                await this.stopProject
                  .getInstance()
                  .stopProjectRunner(projectId);
                Logger.log('ça timeout');
              }, 300_000);
              Logger.log('on déclenche le timeout dans 5 minutes');
              addDisconnectigProjectTimeout(room, timeOut);
            }
            deleteConnectedUsers(room, client.data.username);
            AmqpService.getInstance().sendBroadcastMessage(
              'sendUser',
              'messages',
              JSON.stringify({ room: 'gastric-coral-condor' }),
            );
            //this.sendUserInRoom(room);
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
    client.rooms.forEach(async (room) => {
      this.sendLogsToClient(room);
    });
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
    client.rooms.forEach(async (room) => {
      this.sendLogsToClient(room);
    });
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
    client.rooms.forEach(async (room) => {
      this.sendLogsToClient(room);
    });
  }

  @SubscribeMessage('uploadImage')
  async uploadImage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { base64: string; path: string },
  ): Promise<void> {
    const basePath = `${process.env.BASE_PATH_PROJECT}/${body.path}`;
    await this.createImage.getInstance().createImage(body.base64, basePath);
    const editProject: EditProjectDTO[] = [
      {
        name: body.path,
        type: 'file',
        fullPath: basePath,
        folderStatus: FolderStatus.CREATED,
        modifications: [],
      },
    ];
    this.broadcastEditProject(
      'projectModificationFromContributor',
      editProject,
      client,
    );
    client.rooms.forEach(async (room) => {
      this.sendLogsToClient(room);
    });
  }

  @SubscribeMessage('socketReadyToReceiveDevelopers')
  async readyToReceiveDevelopers(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { projectId: string },
  ): Promise<void> {
    AmqpService.getInstance().sendBroadcastMessage(
      'sendUser',
      'messages',
      JSON.stringify({ room: body.projectId }),
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

  private broadcastSiteIsReady(client: Socket) {
    client.rooms.forEach(async (room) => {
      this.server.to(room).emit('siteIsReady');
    });
    client.rooms.forEach(async (room) => {
      this.sendLogsToClient(room);
    });
  }

  private sendLogsToClient(room: string): void {
    console.log('je passe dans sendLogs');
    console.log('avec le projectId' + room);
    setTimeout(async () => {
      try {
        Logger.log(
          `path -> ${process.env.LOG_PATH_PROJECT}/${room}/${room}.log`,
        );
        const contentLogFile = await fs.readFile(
          `${process.env.LOG_PATH_PROJECT}/${room}/${room}.log`,
          { encoding: 'utf-8' },
        );
        this.server.to(room).emit('logChanged', contentLogFile);
      } catch (error) {}
    }, 4000);
  }

  private checkCodeRunnerStatus(projectId: string, client: Socket) {
    const interval = setInterval(async () => {
      let codeRunnerUrl = process.env.CODE_RUNNER_DNS_SUFFIX;
      if (!codeRunnerUrl.includes('localhost')) {
        codeRunnerUrl = 'https://' + projectId + codeRunnerUrl;
      }
      this.httpService.get(codeRunnerUrl).subscribe(
        (res) => {
          if (res.status === 200) {
            this.broadcastSiteIsReady(client);
            clearInterval(interval);
          }
        },
        (error) => {},
      );
    }, 5000);
  }

  private sendUserInRoom(projectId: string) {
    console.log('je passe dans sendLogs');
    console.log('avec le projectId' + projectId);
    const connectedUsers = getConnectedUsers(projectId);
    if (connectedUsers === undefined) return;
    this.server
      .to(projectId)
      .emit('developerConnected', getConnectedUsers(projectId));
  }
}
