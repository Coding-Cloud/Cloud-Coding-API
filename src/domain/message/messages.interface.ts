import { Message } from './message';

export interface Messages {
  createMessage(message: Message): Promise<string>;

  findByConversation(conversationId: string): Promise<Message[]>;

  deleteMessage(id: string): Promise<void>;
}
