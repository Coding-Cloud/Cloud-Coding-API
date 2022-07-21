import { Logger } from '@nestjs/common';
import { Friendships } from '../../domain/friendship/friendships.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class RemoveFriendshipUseCase {
  constructor(
    private readonly friendships: Friendships,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async removeFriendship(id: string): Promise<void> {
    this.eventEmitter.emit('friendship.deleted', id);
    await this.friendships.removeFriendship(id);
    Logger.log(`Deleted friendship ${id}`);
  }
}
