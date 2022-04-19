import { Friendships } from '../../domain/friendship/friendships.interface';
import { Inject } from '@nestjs/common';
import { UseCasesProxyConversationModule } from '../../infrastructure/usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { CreateConversationUseCase } from '../conversation/create-conversation.usecase';
import { CreateFriendshipCandidate } from './candidates/create-friendship.candidate';

export class CreateFriendshipUseCase {
  constructor(
    private readonly friendRequests: Friendships,
    @Inject(UseCasesProxyConversationModule.CREATE_CONVERSATION_USE_CASES_PROXY)
    private readonly createConversation: UseCaseProxy<CreateConversationUseCase>,
  ) {}

  async createFriendship(user1Id: string, user2Id: string): Promise<string> {
    const conversationId = await this.createConversation
      .getInstance()
      .createConversation();
    const friendshipCandidate: CreateFriendshipCandidate = {
      user1Id,
      user2Id,
      conversationId,
    };
    return await this.friendRequests.createFriendship(friendshipCandidate);
  }
}
