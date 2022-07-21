import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UseCasesProxyConversationModule } from '../../usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { RemoveConversationUseCase } from '../../../usecases/conversation/remove-conversation.usecase';
import { CreateConversationUseCase } from '../../../usecases/conversation/create-conversation.usecase';

export class ConversationEventHandlers {
  constructor(
    @Inject(UseCasesProxyConversationModule.CREATE_CONVERSATION_USE_CASES_PROXY)
    private readonly createConversationUseCase: UseCaseProxy<CreateConversationUseCase>,
    @Inject(UseCasesProxyConversationModule.REMOVE_CONVERSATION_USE_CASES_PROXY)
    private readonly removeConversationUseCase: UseCaseProxy<RemoveConversationUseCase>,
  ) {}

  @OnEvent('group.deleted')
  async handleGroupDeleted(groupId: string) {
    await this.removeConversationUseCase
      .getInstance()
      .removeConversationByGroupId(groupId);
  }

  @OnEvent('group.created')
  async handleGroupCreated(groupId: string) {
    await this.createConversationUseCase
      .getInstance()
      .createConversation({ groupId });
  }

  @OnEvent('friendship.created')
  async handleFriendshipCreated(friendshipId: string) {
    await this.createConversationUseCase
      .getInstance()
      .createConversation({ friendshipId });
  }
}
