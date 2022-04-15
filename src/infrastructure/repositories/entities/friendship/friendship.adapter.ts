import { FriendshipEntity } from './friendship.entity';
import { Friendship } from '../../../../domain/friendship/friendship';

export default class FriendshipAdapter {
  static toFriendship(friendship: FriendshipEntity): Friendship {
    const { user1Id, user2Id, createdAt } = friendship;
    return {
      user1Id,
      user2Id,
      createdAt,
    };
  }

  static toFriendshipEntity(friendship: Friendship): FriendshipEntity {
    return {
      ...friendship,
    };
  }
}
