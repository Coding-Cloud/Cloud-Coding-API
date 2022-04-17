import { Friendships } from '../../domain/friendship/friendships.interface';
import { Inject } from '@nestjs/common';
import { UseCasesProxyConversationModule } from '../../infrastructure/usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { CreateConversationUseCase } from '../conversation/create-conversation.usecase';
import { Friendship } from '../../domain/friendship/friendship';

export class CreateFriendshipUseCase {
  constructor(
    private readonly friendRequests: Friendships,
    @Inject(UseCasesProxyConversationModule.CREATE_CONVERSATION_USE_CASES_PROXY)
    private readonly createConversation: UseCaseProxy<CreateConversationUseCase>,
  ) {}

  async createFriendship(friendship: Friendship): Promise<string> {
    friendship.conversationId = await this.createConversation
      .getInstance()
      .createConversation();
    return await this.friendRequests.createFriendship(friendship);
  }
}
