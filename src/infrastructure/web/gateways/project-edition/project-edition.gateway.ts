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
import { CreateProjectRunnerUsecase } from '../../../../usecases/project-edition/create-project-runner.usecase';
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
import {
  addDisconnectingProjectTimeout,
  deleteDisconnectingProjectTimeout,
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
import { AmqpQueue } from '../../../amqp/amqp-queue';
import { RoomDto } from './amqp-event-dto/room-dto';
import { SendLogsToClientDto } from './amqp-event-dto/send-logs-to-client-dto';
import { BroadcastRenameProjectDto } from './amqp-event-dto/broadcast-rename-project-dto';
import { BroadcastDeleteFolderDto } from './amqp-event-dto/broadcast-delete-folder-dto';
import { BroadcastEditProjectDto } from './amqp-event-dto/broadcast-edit-project-dto';
import { BroadcastProjectVersionDto } from './amqp-event-dto/broadcast-project-version-dto';
import { UseCasesProxyProjectVersioningModule } from '../../../usecases-proxy/project-version/use-cases-proxy-project-version.module';
import { GetProjectVersionsUseCase } from '../../../../usecases/project-version/get-project-versions.usecase';
import { DependenciesProjectRunnerUseCase } from '../../../../usecases/project-edition/dependencies-project-runner-use.case';
import { RestartProjectRunnerUseCase } from '../../../../usecases/project-edition/restart-project-runner-use.case';
import * as io from 'socket.io-client';

@WebSocketGateway({ path: '/code-runner' })
@Injectable()
export class ProjectEditionGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  CODE_RUNNER_EXCHANGE_NAME = 'runnerExchange';

  private connectedRunnerSockets: Map<string, any> = new Map<string, any>();

  constructor(
    private httpService: HttpService,
    @Inject(
      UseCasesProxyProjectEditionModule.CREATE_PROJECT_RUNNER_USE_CASES_PROXY,
    )
    private readonly createProject: UseCaseProxy<CreateProjectRunnerUsecase>,
    @Inject(
      UseCasesProxyProjectEditionModule.STOP_PROJECT_RUNNER_USE_CASES_PROXY,
    )
    private readonly stopProject: UseCaseProxy<StopProjectRunnerUseCase>,
    @Inject(
      UseCasesProxyProjectEditionModule.RESTART_PROJECT_RUNNER_USE_CASES_PROXY,
    )
    private readonly restartProject: UseCaseProxy<RestartProjectRunnerUseCase>,
    @Inject(
      UseCasesProxyProjectEditionModule.DEPENDENCIES_PROJECT_RUNNER_USE_CASES_PROXY,
    )
    private readonly dependenciesProject: UseCaseProxy<DependenciesProjectRunnerUseCase>,
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
    @Inject(
      UseCasesProxyProjectVersioningModule.GET_PROJECT_VERSIONS_USE_CASES_PROXY,
    )
    private readonly getVersions: UseCaseProxy<GetProjectVersionsUseCase>,
  ) {
    this.initAmqpCodeRunner().then();
  }

  async initAmqpCodeRunner(): Promise<void> {
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
      this.CODE_RUNNER_EXCHANGE_NAME,
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
      this.CODE_RUNNER_EXCHANGE_NAME,
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
      this.CODE_RUNNER_EXCHANGE_NAME,
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
      this.CODE_RUNNER_EXCHANGE_NAME,
    );

    const amqpQueueDeleteProject = new AmqpQueue(
      '',
      'deleteProjectFolder',
      {
        exclusive: true,
        durable: true,
      },
      {
        noAck: false,
      },
      this.broadcastDeleteFolderProjectAMQP.bind(this),
      this.CODE_RUNNER_EXCHANGE_NAME,
    );

    const amqpQueueProjectVersionChanged = new AmqpQueue(
      '',
      'currentProjectVersionHasChanged',
      {
        exclusive: true,
        durable: true,
      },
      {
        noAck: false,
      },
      this.broadcastSendVersionsUpdateAMQP.bind(this),
      this.CODE_RUNNER_EXCHANGE_NAME,
    );

    await AmqpService.getInstance().addQueue(amqpQueue);
    await AmqpService.getInstance().addQueue(amqpQueueSendLogsToClient);
    await AmqpService.getInstance().addQueue(amqpQueueEditProject);
    await AmqpService.getInstance().addQueue(amqpQueueRenameFolderProject);
    await AmqpService.getInstance().addQueue(amqpQueueDeleteProject);
    await AmqpService.getInstance().addQueue(amqpQueueProjectVersionChanged);
  }

  //TODO: refactoring all the connexion system with specific usecase
  async handleConnection(client: Socket): Promise<void> {
    try {
      await this.onConnect(client);
      client.on('disconnecting', () => {
        this.onDisconnect(client);
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
    Logger.log('edit project event trigger');
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
    Logger.log('renameFolder event trigger');
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
    Logger.log('delete folder event trigger');
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

  @SubscribeMessage('uploadImage')
  async uploadImage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { base64: string; path: string },
  ): Promise<void> {
    Logger.log('upload image event trigger');
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
  }

  @SubscribeMessage('socketReadyToReceiveDevelopers')
  async readyToReceiveDevelopers(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { projectId: string },
  ): Promise<void> {
    Logger.log('socketReadyToReceiveDevelopers event trigger');
    AmqpService.getInstance().sendBroadcastMessage(
      'sendUser',
      JSON.stringify({ room: body.projectId }),
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
  }

  @SubscribeMessage('currentProjectVersionHasChanged')
  async currentProjectVersionHasChanged(
    @MessageBody() body: { uniqueName: string },
  ) {
    Logger.log('currentProjectVersionHasChanged event trigger');
    const versions = await this.getVersions
      .getInstance()
      .getProjectVersions(body.uniqueName);
    //const versions = ['1.0.0', '1.0.1', '1.0.2'];
    AmqpService.getInstance().sendBroadcastMessage(
      'currentProjectVersionHasChanged',
      JSON.stringify({
        versions,
        room: body.uniqueName,
      } as BroadcastProjectVersionDto),
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
  }

  @SubscribeMessage('resolveDependencies')
  async resolveDependencies(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { uniqueName: string },
  ): Promise<void> {
    Logger.log('resolveDependencies event trigger');
    this.dependenciesProject
      .getInstance()
      .dependenciesProjectRunner(body.uniqueName)
      .then();
  }

  @SubscribeMessage('restartRunner')
  async restartRunner(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { uniqueName: string },
  ): Promise<void> {
    Logger.log('restartRunner event trigger');
    this.restartProject
      .getInstance()
      .restartProjectRunner(body.uniqueName)
      .then();
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

    AmqpService.getInstance().sendBroadcastMessage(
      'editProject',
      JSON.stringify({
        room: roomOfficial,
        event,
        editsProject: editProjectDTO,
        socket: client.id,
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
      'renameFolderProject',
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
      'deleteProjectFolder',
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
  }

  private checkRunningProjectStatus(uniqueName: string, client: Socket) {
    const interval = setInterval(async () => {
      let runningProjectUrl = process.env.CODE_RUNNER_DNS_SUFFIX;
      if (!runningProjectUrl.includes('localhost')) {
        runningProjectUrl = `https://${uniqueName}${runningProjectUrl}`;
      }
      this.httpService.get(runningProjectUrl).subscribe({
        next: (res) => {
          if (res.status === 200) {
            this.broadcastSiteIsReady(client);
            clearInterval(interval);
          }
        },
        error: () => undefined,
      });
    }, 5000);
  }

  private checkCodeRunnerStatus(uniqueName: string) {
    const interval = setInterval(async () => {
      let codeRunnerUrl = process.env.CODE_RUNNER_DNS_SUFFIX;
      if (!codeRunnerUrl.includes('localhost')) {
        codeRunnerUrl = `http://${uniqueName}-${process.env.CODE_RUNNER_URL}/status`;
      }
      this.httpService.get(codeRunnerUrl).subscribe({
        next: (res) => {
          if (res.status === 200) {
            if (!this.connectedRunnerSockets.has(uniqueName)) {
              this.connectCodeRunner(uniqueName);
            }
            clearInterval(interval);
          }
        },
        error: () => undefined,
      });
    }, 5000);
  }

  private async onConnect(client: Socket) {
    Logger.log('Client connected');

    const uniqueName = client.handshake.query.projectId as string;
    const username = client.handshake.query.username as string;

    client.join(uniqueName);
    client.data.username = username;
    addConnectedUsers(uniqueName, username);
    this.checkRunningProjectStatus(uniqueName, client);
    this.checkCodeRunnerStatus(uniqueName);
    deleteDisconnectingProjectTimeout(uniqueName);

    await this.createProject.getInstance().createProjectRunner(uniqueName);
  }

  private onDisconnect(client: Socket) {
    Logger.log('on passe bien dans le on Disconnect');
    const uniqueName = client.handshake.query.projectId as string;
    client.rooms.forEach(async (room) => {
      if (this.server.sockets.adapter.rooms.get(room).size === 1) {
        if (getConnectedUsers(room)) {
          const timeOut = setTimeout(async () => {
            this.connectedRunnerSockets.get(uniqueName).close();
            this.connectedRunnerSockets.delete(uniqueName);
            await this.stopProject.getInstance().stopProjectRunner(uniqueName);
            Logger.log(`Timed out code runner ${uniqueName}`);
          }, 300_000);
          Logger.log(`Timing out code runner ${uniqueName} in 5 minutes`);
          addDisconnectingProjectTimeout(uniqueName, timeOut);
        }
        deleteConnectedUsers(uniqueName, client.data.username);
        AmqpService.getInstance().sendBroadcastMessage(
          'sendUser',
          JSON.stringify({ room: 'gastric-coral-condor' }),
          this.CODE_RUNNER_EXCHANGE_NAME,
        );
        //this.roomDto(roomDto);
      }
    });
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

  private broadcastSendVersionsUpdateAMQP(
    broadcastProjectVersionDto: BroadcastProjectVersionDto,
  ) {
    this.server
      .to(broadcastProjectVersionDto.room)
      .emit(
        'currentProjectVersionHasChanged',
        broadcastProjectVersionDto.versions,
      );
  }

  private sendLogsToClientAMQP(sendLogsToClientDto: SendLogsToClientDto): void {
    this.server
      .to(sendLogsToClientDto.room)
      .emit('logChanged', sendLogsToClientDto.content);
  }

  private sendUserInRoomAMQP(roomDTO: RoomDto) {
    Logger.log('sendUserInRoomAMQP');
    const connectedUsers = getConnectedUsers(roomDTO.room);
    if (connectedUsers === undefined) return;
    Logger.log('User connected to websocket');
    Logger.log(connectedUsers);
    this.server
      .to(roomDTO.room)
      .emit('developerConnected', getConnectedUsers(roomDTO.room));
  }

  // ws client

  private connectCodeRunner(uniqueName: string) {
    const socket = io(`http://${uniqueName}-${process.env.CODE_RUNNER_URL}`, {
      transports: ['websocket'],
    });
    socket.on('logs', (logs) => this.onLogsReceived(logs, uniqueName));
    this.connectedRunnerSockets.set(uniqueName, socket);
  }

  private onLogsReceived(logs: string, uniqueName: string) {
    AmqpService.getInstance().sendBroadcastMessage(
      'sendLogsToClient',
      JSON.stringify({
        room: uniqueName,
        content: logs,
      }),
      this.CODE_RUNNER_EXCHANGE_NAME,
    );
  }
}
