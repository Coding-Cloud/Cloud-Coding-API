import { Conversation } from '../../domain/conversation/conversation';
import { Conversations } from '../../domain/conversation/conversations.interface';

export class FindUserConversationsUseCase {
  constructor(private readonly conversations: Conversations) {}

  async findUserConversations(id: string): Promise<Conversation[]> {
    return this.conversations.findUserConversationById(id);
  }
}
