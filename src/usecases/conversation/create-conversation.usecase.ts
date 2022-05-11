import { Conversations } from '../../domain/conversation/conversations.interface';
import { CreateConversationCandidate } from './candidates/create-conversation.candidate';

export class CreateConversationUseCase {
  constructor(private readonly conversations: Conversations) {}

  async createConversation(
    ownership: CreateConversationCandidate,
  ): Promise<string> {
    return await this.conversations.createConversation(ownership);
  }
}
