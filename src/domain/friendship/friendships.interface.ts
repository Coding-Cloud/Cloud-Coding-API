import { Friendship } from './friendship';

export interface Friendships {
  createFriendship(user1Id: string, user2Id: string): Promise<string>;

  findByUserId(userId: string): Promise<Friendship[]>;

  removeFriendship(id: string): Promise<void>;
}
