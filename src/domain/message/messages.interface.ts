import { Message } from './message';
import { CreateMessageCandidate } from '../../usecases/message/candidates/create-message.candidate';
import { UpdateMessageCandidate } from '../../usecases/message/candidates/update-message.candidate';

export interface Messages {
  findById(id: string): Promise<Message>;

  createMessage(message: CreateMessageCandidate): Promise<string>;

  updateMessage(id: string, message: UpdateMessageCandidate): Promise<void>;

  findByConversation(
    conversationId: string,
    limit?: number,
    offset?: number,
  ): Promise<[Message[], number]>;

  deleteMessage(id: string): Promise<void>;
}
