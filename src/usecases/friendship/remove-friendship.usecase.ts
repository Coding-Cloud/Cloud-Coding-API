import { Logger } from '@nestjs/common';
import { TypeormFriendshipsRepository } from '../../infrastructure/repositories/repositories/typeorm-friendships.repository';

export class RemoveFriendshipUseCase {
  constructor(private readonly friendRequests: TypeormFriendshipsRepository) {}

  async removeFriendship(id: string): Promise<void> {
    await this.friendRequests.removeFriendship(id);
    Logger.log(`Deleted friendship ${id}`);
  }
}
