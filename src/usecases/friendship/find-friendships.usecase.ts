import { Friendship } from '../../domain/friendship/friendship';
import { Friendships } from '../../domain/friendship/friendships.interface';

export class FindFriendshipsUseCase {
  constructor(private readonly friendships: Friendships) {}

  async findFriendships(userId: string): Promise<Friendship[]> {
    return this.friendships.findByUserId(userId);
  }

  async findUsersFriendship(
    user1Id: string,
    user2Id: string,
  ): Promise<Friendship> {
    return this.friendships.findByUsers(user1Id, user2Id);
  }
}
