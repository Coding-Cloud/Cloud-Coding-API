import { Friendship } from '../../domain/friendship/friendship';
import { Friendships } from '../../domain/friendship/friendships.interface';

export class FindFriendshipsUseCase {
  constructor(private readonly friendRequests: Friendships) {}

  async findFriendships(userId: string): Promise<Friendship[]> {
    return this.friendRequests.findByUserId(userId);
  }
}
