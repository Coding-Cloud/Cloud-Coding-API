import { Conversation } from '../../domain/conversation/conversation';
import { Conversations } from '../../domain/conversation/conversations.interface';

export class FindUserConversationsUseCase {
  constructor(private readonly conversations: Conversations) {}

  async findUserConversations(
    id: string,
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<Conversation[]> {
    return this.conversations.findUserConversationById(
      id,
      search,
      limit,
      offset,
    );
  }
}
