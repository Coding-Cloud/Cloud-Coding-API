import { MessageEntity } from './message.entity';
import { Message } from '../../../../domain/message/message';

export default class MessageAdapter {
  static toMessage(message: MessageEntity): Message {
    const { id, content, assetId, userId, conversationId, createdAt } = message;
    return {
      id,
      content,
      userId,
      assetId,
      conversationId,
      createdAt,
    };
  }

  static toGroupEntity(message: Message): MessageEntity {
    return {
      ...message,
    };
  }
}
