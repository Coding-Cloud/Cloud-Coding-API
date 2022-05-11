import { Logger } from '@nestjs/common';
import { Conversations } from '../../domain/conversation/conversations.interface';

export class RemoveConversationUseCase {
  constructor(private readonly conversations: Conversations) {}

  async removeConversationByGroupId(id: string): Promise<void> {
    await this.conversations.removeConversationByGroupId(id);
    Logger.log(`Delete conversation {${id}}`);
  }

  async removeConversationByFriendshipId(id: string): Promise<void> {
    await this.conversations.removeConversationByFriendshipId(id);
    Logger.log(`Delete conversation {${id}}`);
  }
}
