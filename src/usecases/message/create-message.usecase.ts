import { Message } from '../../domain/message/message';
import { Messages } from '../../domain/message/messages.interface';

export class CreateMessageUseCase {
  constructor(private readonly messages: Messages) {}

  async createMessage(message: Message): Promise<string> {
    return await this.messages.createMessage(message);
  }
}
