import { Message } from './message';
import { CreateMessageCandidate } from '../../usecases/message/candidates/create-message.candidate';

export interface Messages {
  findById(id: string): Promise<Message>;

  createMessage(message: CreateMessageCandidate): Promise<string>;

  findByConversation(
    conversationId: string,
    limit?: number,
    offset?: number,
  ): Promise<Message[]>;

  deleteMessage(id: string): Promise<void>;
}
