import { Messages } from '../../domain/message/messages.interface';

export class DeleteMessageUseCase {
  constructor(private readonly messages: Messages) {}

  async deleteMessage(id: string): Promise<void> {
    return await this.messages.deleteMessage(id);
  }
}
