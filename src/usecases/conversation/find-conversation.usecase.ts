import { Conversation } from '../../domain/conversation/conversation';
import { Conversations } from '../../domain/conversation/conversations.interface';

export class FindConversationUseCase {
  constructor(private readonly conversations: Conversations) {}

  async findConversation(id: string): Promise<Conversation> {
    return this.conversations.findConversationById(id);
  }
}
