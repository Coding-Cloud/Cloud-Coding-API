import { Conversations } from '../../domain/conversation/conversations.interface';

export class CreateConversationUseCase {
  constructor(private readonly conversations: Conversations) {}

  async createConversation(): Promise<string> {
    return await this.conversations.createConversation();
  }
}
