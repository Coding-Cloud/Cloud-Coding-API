import { Friendship } from './friendship';

export interface Friendships {
  createFriendship(friendship: Friendship): Promise<string>;

  findByUserId(userId: string): Promise<Friendship[]>;

  findById(id: string): Promise<Friendship>;

  removeFriendship(id: string): Promise<void>;
}
