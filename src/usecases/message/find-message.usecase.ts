import { Messages } from '../../domain/message/messages.interface';
import { Message } from '../../domain/message/message';

export class FindMessageUseCase {
  constructor(private readonly messages: Messages) {}

  async findById(id: string): Promise<Message> {
    return await this.messages.findById(id);
  }
}
