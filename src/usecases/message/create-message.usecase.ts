import { Messages } from '../../domain/message/messages.interface';
import { CreateMessageCandidate } from './candidates/create-message.candidate';

export class CreateMessageUseCase {
  constructor(private readonly messages: Messages) {}

  async createMessage(message: CreateMessageCandidate): Promise<string> {
    return await this.messages.createMessage(message);
  }
}
