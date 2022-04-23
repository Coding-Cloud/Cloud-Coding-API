import { Logger } from '@nestjs/common';
import { Conversations } from '../../domain/conversation/conversations.interface';

export class RemoveConversationUseCase {
  constructor(private readonly conversations: Conversations) {}

  async removeConversation(id: string): Promise<void> {
    await this.conversations.removeConversation(id);
    Logger.log(`Delete conversation {${id}}`);
  }
}
