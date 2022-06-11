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
import { AmqpService } from '../../../amqp/amqp-service';
import { AmqpExchange } from '../../../amqp/amqp-exchange';
import { AmqpQueue } from '../../../amqp/amqp-queue';
import { RoomDto } from './amqp-event-dto/room-dto';
import { SendLogsToClientDto } from './amqp-event-dto/send-logs-to-client-dto';
import { BroadcastRenameProjectDto } from './amqp-event-dto/broadcast-rename-project-dto';
import { BroadcastDeleteFolderDto } from './amqp-event-dto/broadcast-delete-folder-dto';
import { BroadcastEditProjectDto } from './amqp-event-dto/broadcast-edit-project-dto';

@WebSocketGateway()
@Injectable()
export class ProjectEditionGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  CODE_RUNNER_EXCHANGE_NAME = 'codeRunnerSocket';

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
    const amqpExchange = new AmqpExchange(
      'direct',
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
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
      this.sendUserInRoomAMQP.bind(this),
    );

    const amqpQueueSendLogsToClient = new AmqpQueue(
      '',
      'sendLogsToClient',
      {
        exclusive: true,
        durable: true,
      },
      {
        noAck: false,
      },
      this.sendLogsToClientAMQP.bind(this),
    );

    const amqpQueueEditProject = new AmqpQueue(
      '',
      'editProject',
      {
        exclusive: true,
        durable: true,
      },
      {
        noAck: false,
      },
      this.broadcastEditProjectAMQP.bind(this),
    );

    const amqpQueueRenameFolderProject = new AmqpQueue(
      '',
      'renameFolderProject',
      {
        exclusive: true,
        durable: true,
      },
      {
        noAck: false,
      },
      this.broadcastRenameProjectAMQP.bind(this),
    );

    const amqpQueueDeleteProject = new AmqpQueue(
      '',
      'deleteProject',
      {
        exclusive: true,
        durable: true,
      },
      {
        noAck: false,
      },
      this.broadcastDeleteFolderProjectAMQP.bind(this),
    );

    await AmqpService.getInstance().addExchange(amqpExchange);
    await AmqpService.getInstance().addQueue(
      amqpQueue,
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
    await AmqpService.getInstance().addQueue(
      amqpQueueSendLogsToClient,
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
    await AmqpService.getInstance().addQueue(
      amqpQueueEditProject,
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
    await AmqpService.getInstance().addQueue(
      amqpQueueRenameFolderProject,
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
    await AmqpService.getInstance().addQueue(
      amqpQueueDeleteProject,
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
  }

  //TODO: refactoring all the connexion system with specific usecase
  async handleConnection(client: Socket): Promise<void> {
    try {
      const projectId = client.handshake.query.projectId as string;
      const username = client.handshake.query.username as string;
      client.join(projectId);
      console.log(client.id);
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

      // Add amqp listeners.
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
              JSON.stringify({ room: 'gastric-coral-condor' }),
              this.CODE_RUNNER_EXCHANGE_NAME,
            );
            //this.roomDto(roomDto);
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
      JSON.stringify({ room: body.projectId }),
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
  }

  private broadcastEditProject(
    event: string,
    editProjectDTO: EditProjectDTO[],
    client: Socket,
  ) {
    let roomOfficial: string;
    client.rooms.forEach(async (room) => {
      if (room !== client.id) roomOfficial = room;
      client.broadcast.to(room).emit(event, editProjectDTO);
    });
    console.log('la room de edit : ' + roomOfficial);

    AmqpService.getInstance().sendBroadcastMessage(
      'editProject',
      JSON.stringify({
        room: roomOfficial,
        event,
        editsProject: editProjectDTO,
        socket: 'nehIoagDg1cgTXfUAAAB',
      } as BroadcastEditProjectDto),
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
  }

  private broadcastRenameProject(
    event: string,
    renameFolderResource: RenameFolderResource,
    client: Socket,
  ) {
    let roomOfficial: string;
    client.rooms.forEach(async (room) => {
      if (room !== client.id) roomOfficial = room;
      client.broadcast.to(room).emit(event, renameFolderResource);
    });

    AmqpService.getInstance().sendBroadcastMessage(
      'renameProject',
      JSON.stringify({
        room: roomOfficial,
        event,
        renameFolderResource,
        socket: client.id,
      } as BroadcastRenameProjectDto),
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
  }

  private broadcastDeleteFolderProject(
    event: string,
    deleteFolderResource: DeleteFolderResource,
    client: Socket,
  ) {
    let roomOfficial: string;
    client.rooms.forEach(async (room) => {
      if (room !== client.id) roomOfficial = room;
      client.broadcast.to(room).emit(event, deleteFolderResource);
    });

    AmqpService.getInstance().sendBroadcastMessage(
      'deleteFolderProject',
      JSON.stringify({
        room: roomOfficial,
        event,
        deleteFolderResource,
        socket: client.id,
      } as BroadcastDeleteFolderDto),
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
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
        AmqpService.getInstance().sendBroadcastMessage(
          'sendLogsToClient',
          JSON.stringify({
            room,
            content: contentLogFile,
          } as SendLogsToClientDto),
          this.CODE_RUNNER_EXCHANGE_NAME,
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

  //amqp events

  private broadcastRenameProjectAMQP(
    broadcastRenameProjectDto: BroadcastRenameProjectDto,
  ) {
    const socket = this.server.sockets.sockets.get(
      broadcastRenameProjectDto.socket,
    );
    if (!socket) {
      this.server
        .to(broadcastRenameProjectDto.room)
        .emit(
          broadcastRenameProjectDto.event,
          broadcastRenameProjectDto.renameFolderResource,
        );
    }
  }

  private broadcastDeleteFolderProjectAMQP(
    broadcastDeleteFolderDto: BroadcastDeleteFolderDto,
  ) {
    const socket = this.server.sockets.sockets.get(
      broadcastDeleteFolderDto.socket,
    );
    if (!socket) {
      this.server
        .to(broadcastDeleteFolderDto.room)
        .emit(
          broadcastDeleteFolderDto.event,
          broadcastDeleteFolderDto.deleteFolderResource,
        );
    }
  }

  private broadcastEditProjectAMQP(
    broadcastEditProjectDto: BroadcastEditProjectDto,
  ) {
    const socket = this.server.sockets.sockets.get(
      broadcastEditProjectDto.socket,
    );
    if (!socket) {
      this.server
        .to(broadcastEditProjectDto.room)
        .emit(
          broadcastEditProjectDto.event,
          broadcastEditProjectDto.editsProject,
        );
    }
  }

  private sendLogsToClientAMQP(sendLogsToClientDto: SendLogsToClientDto): void {
    this.server
      .to(sendLogsToClientDto.room)
      .emit('logChanged', sendLogsToClientDto.content);
  }

  private sendUserInRoomAMQP(roomDTO: RoomDto) {
    const connectedUsers = getConnectedUsers(roomDTO.room);
    if (connectedUsers === undefined) return;
    this.server
      .to(roomDTO.room)
      .emit('developerConnected', getConnectedUsers(roomDTO.room));
  }
}
