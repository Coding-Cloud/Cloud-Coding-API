import { Inject, Logger } from '@nestjs/common';
import { Friendships } from '../../domain/friendship/friendships.interface';
import { UseCasesProxyConversationModule } from '../../infrastructure/usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { RemoveConversationUseCase } from '../conversation/remove-conversation.usecase';

export class RemoveFriendshipUseCase {
  constructor(
    private readonly friendships: Friendships,
    @Inject(UseCasesProxyConversationModule.REMOVE_CONVERSATION_USE_CASES_PROXY)
    private readonly removeConversation: UseCaseProxy<RemoveConversationUseCase>,
  ) {}

  async removeFriendship(id: string): Promise<void> {
    const friendship = await this.friendships.findById(id);
    await this.removeConversation
      .getInstance()
      .removeConversation(friendship.conversationId);
    await this.friendships.removeFriendship(id);
    Logger.log(`Deleted friendship ${id}`);
  }
}
