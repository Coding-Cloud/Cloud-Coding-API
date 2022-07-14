import { Friendship } from './friendship';
import { CreateFriendshipCandidate } from '../../usecases/friendship/candidates/create-friendship.candidate';

export interface Friendships {
  createFriendship(
    friendshipCandidate: CreateFriendshipCandidate,
  ): Promise<string>;

  findByUserId(userId: string): Promise<Friendship[]>;

  findByUsers(user1Id: string, user2Id: string): Promise<Friendship>;

  findById(id: string): Promise<Friendship>;

  removeFriendship(id: string): Promise<void>;
}
