import { Messages } from '../../domain/message/messages.interface';
import { UpdateMessageCandidate } from './candidates/update-message.candidate';

export class UpdateMessageUseCase {
  constructor(private readonly messages: Messages) {}

  async updateMessage(
    id: string,
    message: UpdateMessageCandidate,
  ): Promise<void> {
    await this.messages.updateMessage(id, message);
  }
}
