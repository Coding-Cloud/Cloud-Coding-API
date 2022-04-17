import { FriendshipEntity } from './friendship.entity';
import { Friendship } from '../../../../domain/friendship/friendship';

export default class FriendshipAdapter {
  static toFriendship(friendship: FriendshipEntity): Friendship {
    const { id, user1Id, user2Id, conversationId, createdAt } = friendship;
    return {
      id,
      user1Id,
      user2Id,
      conversationId,
      createdAt,
    };
  }

  static toFriendshipEntity(friendship: Friendship): FriendshipEntity {
    return {
      ...friendship,
    };
  }
}
