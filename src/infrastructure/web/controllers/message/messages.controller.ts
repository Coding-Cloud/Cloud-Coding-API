import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { UseCasesProxyMessageModule } from '../../../usecases-proxy/message/use-cases-proxy-message.module';
import { Message } from '../../../../domain/message/message';
import { CreateMessageUseCase } from '../../../../usecases/message/create-message.usecase';
import { FindConversationMessagesUseCase } from '../../../../usecases/message/find-conversation-messages.usecase';
import { DeleteMessageUseCase } from '../../../../usecases/message/delete-message.usecase';
import { CreateMessageDTO } from './dto/create-message.dto';
import { MessageListDto } from './dto/message-list.dto';
import { UpdateMessageUseCase } from '../../../../usecases/message/update-message.usecase';
import { UpdateMessageDTO } from './dto/update-message.dto';

@Controller('messages')
@ApiTags('messages')
@ApiSecurity('auth-token')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(
    @Inject(UseCasesProxyMessageModule.CREATE_MESSAGE_USE_CASES_PROXY)
    private readonly createMessage: UseCaseProxy<CreateMessageUseCase>,
    @Inject(
      UseCasesProxyMessageModule.FIND_CONVERSATION_MESSAGES_USE_CASES_PROXY,
    )
    private readonly getMessage: UseCaseProxy<FindConversationMessagesUseCase>,
    @Inject(UseCasesProxyMessageModule.DELETE_MESSAGE_USE_CASES_PROXY)
    private readonly deleteMessage: UseCaseProxy<DeleteMessageUseCase>,
    @Inject(UseCasesProxyMessageModule.UPDATE_MESSAGE_USE_CASES_PROXY)
    private readonly updateMessage: UseCaseProxy<UpdateMessageUseCase>,
  ) {}

  @Post('/:conversationId')
  create(
    @Body() createMessageDTO: CreateMessageDTO,
    @GetUser() user: User,
    @Param('conversationId') conversationId: string,
  ): Promise<string> {
    const message = new Message();
    message.userId = user.id;
    message.content = createMessageDTO.content;
    message.assetId = createMessageDTO.assetId;
    message.conversationId = conversationId;

    return this.createMessage.getInstance().createMessage(message);
  }

  @Get('/:conversationId')
  async findByConversationId(
    @Param('conversationId') conversationId: string,
  ): Promise<MessageListDto> {
    const [messages, totalResults] = await this.getMessage
      .getInstance()
      .findByConversation(conversationId);
    return { messages, totalResults };
  }

  @Patch('/:messageId')
  async updateMessageById(
    @Param('messageId') messageId: string,
    @Body() messageDto: UpdateMessageDTO,
  ): Promise<void> {
    await this.updateMessage.getInstance().updateMessage(messageId, messageDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.deleteMessage.getInstance().deleteMessage(id);
  }
}
