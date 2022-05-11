import { Friendships } from '../../domain/friendship/friendships.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class CreateFriendshipUseCase {
  constructor(
    private readonly friendRequests: Friendships,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createFriendship(user1Id: string, user2Id: string): Promise<string> {
    const friendshipId = await this.friendRequests.createFriendship({
      user1Id,
      user2Id,
    });
    this.eventEmitter.emit('friendship.created', friendshipId);
    return friendshipId;
  }
}
