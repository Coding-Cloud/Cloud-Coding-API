import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Injectable, Logger, UseGuards } from '@nestjs/common';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { UseCasesProxyMessageModule } from '../../../usecases-proxy/message/use-cases-proxy-message.module';
import { CreateMessageUseCase } from '../../../../usecases/message/create-message.usecase';
import { FindConversationMessagesUseCase } from '../../../../usecases/message/find-conversation-messages.usecase';
import { DeleteMessageUseCase } from '../../../../usecases/message/delete-message.usecase';
import { AuthGuard } from '../../controllers/auth/auth.guards';
import { CreateMessageDTO } from './dto/create-message.dto';
import { GetUser } from '../../controllers/decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { UseCasesProxyConversationModule } from '../../../usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { FindUserConversationsUseCase } from '../../../../usecases/conversation/find-user-conversations.usecase';
import { GetMessagesDto } from './dto/get-messages.dto';
import { GetConversationsDto } from './dto/get-conversations.dto';
import { FindMessageUseCase } from '../../../../usecases/message/find-message.usecase';

@UseGuards(AuthGuard)
@WebSocketGateway({ namespace: 'messaging' })
@Injectable()
export class MessagingGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(
      UseCasesProxyMessageModule.FIND_CONVERSATION_MESSAGES_USE_CASES_PROXY,
    )
    private readonly getConversationMessages: UseCaseProxy<FindConversationMessagesUseCase>,
    @Inject(
      UseCasesProxyConversationModule.FIND_USER_CONVERSATIONS_USE_CASES_PROXY,
    )
    private readonly findUserConversations: UseCaseProxy<FindUserConversationsUseCase>,
    @Inject(UseCasesProxyMessageModule.CREATE_MESSAGE_USE_CASES_PROXY)
    private readonly createMessage: UseCaseProxy<CreateMessageUseCase>,
    @Inject(UseCasesProxyMessageModule.DELETE_MESSAGE_USE_CASES_PROXY)
    private readonly deleteMessage: UseCaseProxy<DeleteMessageUseCase>,
    @Inject(UseCasesProxyMessageModule.FIND_MESSAGE_USE_CASES_PROXY)
    private readonly findMessage: UseCaseProxy<FindMessageUseCase>,
  ) {}

  @SubscribeMessage('getMessages')
  async getMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() getMessagesDto: GetMessagesDto,
  ): Promise<void> {
    const messages = await this.getConversationMessages
      .getInstance()
      .findByConversation(
        getMessagesDto.conversationId,
        getMessagesDto.limit,
        getMessagesDto.offset,
      );
    client.emit('messages', messages);
  }

  @SubscribeMessage('getConversations')
  async getConversations(
    @ConnectedSocket() client: Socket,
    @GetUser() user: User,
    @MessageBody() getConversationDto: GetConversationsDto,
  ): Promise<void> {
    try {
      const conversations = await this.findUserConversations
        .getInstance()
        .findUserConversations(
          user.id,
          getConversationDto.search,
          getConversationDto.limit,
          getConversationDto.offset,
        );
      conversations.forEach((conversation) => client.join(conversation.id));
      client.emit('conversations', conversations);
    } catch (e) {
      Logger.error(e);
    }
  }

  @SubscribeMessage('sendMessage')
  async create(
    @ConnectedSocket() client: Socket,
    @GetUser() user: User,
    @MessageBody() messageDTO: CreateMessageDTO,
  ): Promise<void> {
    try {
      const messageCandidate = {
        userId: user.id,
        content: messageDTO.content,
        conversationId: messageDTO.conversationId,
        assetId: messageDTO.assetId,
      };
      const messageId = await this.createMessage
        .getInstance()
        .createMessage(messageCandidate);
      const message = await this.findMessage.getInstance().findById(messageId);
      this.server.to(messageDTO.conversationId).emit('messageCreated', message);
    } catch (e) {
      Logger.error(e);
    }
  }

  @SubscribeMessage('deleteMessage')
  async delete(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageId: string,
  ): Promise<void> {
    try {
      const conversationId = client.handshake.query.conversationId as string;
      await this.deleteMessage.getInstance().deleteMessage(messageId);
      this.server.to(conversationId).emit('messageDeleted', messageId);
    } catch (e) {
      Logger.error(e);
    }
  }
}
