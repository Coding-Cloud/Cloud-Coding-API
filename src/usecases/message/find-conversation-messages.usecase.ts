import { Messages } from '../../domain/message/messages.interface';
import { Message } from '../../domain/message/message';

export class FindConversationMessagesUseCase {
  constructor(private readonly messages: Messages) {}

  async findByConversation(
    conversationId: string,
    limit?: number,
    offset?: number,
  ): Promise<[Message[], number]> {
    return await this.messages.findByConversation(
      conversationId,
      limit,
      offset,
    );
  }
}
