import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { UseCasesProxyConversationModule } from '../../../usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { FindConversationUseCase } from '../../../../usecases/conversation/find-conversation.usecase';
import { Conversation } from '../../../../domain/conversation/conversation';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { FindUserConversationsUseCase } from '../../../../usecases/conversation/find-user-conversations.usecase';

@Controller('conversations')
@ApiTags('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(
    @Inject(UseCasesProxyConversationModule.FIND_CONVERSATION_USE_CASES_PROXY)
    private readonly findConversation: UseCaseProxy<FindConversationUseCase>,
    @Inject(
      UseCasesProxyConversationModule.FIND_USER_CONVERSATIONS_USE_CASES_PROXY,
    )
    private readonly findUserConversations: UseCaseProxy<FindUserConversationsUseCase>,
  ) {}

  @Get('/:id')
  findById(@Param('id') id: string): Promise<Conversation> {
    return this.findConversation.getInstance().findConversation(id);
  }

  @Get()
  findConversations(@GetUser() user: User): Promise<Conversation[]> {
    return this.findUserConversations
      .getInstance()
      .findUserConversations(user.id);
  }

  @Get('/friendship/:friendshipId')
  findConversationByFriendshipId(
    @Param('friendshipId') friendshipId: string,
  ): Promise<Conversation> {
    return this.findConversation
      .getInstance()
      .findConversationByFriendshipId(friendshipId);
  }

  @Get('/group/:groupId')
  findConversationByGroupId(
    @Param('groupId') groupId: string,
  ): Promise<Conversation> {
    return this.findConversation
      .getInstance()
      .findConversationByGroupId(groupId);
  }
}
