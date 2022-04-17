import { ConversationEntity } from './conversation.entity';
import { Conversation } from '../../../../domain/conversation/conversation';

export default class ConversationAdapter {
  static toConversation(conversation: ConversationEntity): Conversation {
    const { id, createdAt } = conversation;
    return {
      id,
      createdAt,
    };
  }

  static toConversationEntity(conversation: Conversation): ConversationEntity {
    return {
      ...conversation,
    };
  }
}
