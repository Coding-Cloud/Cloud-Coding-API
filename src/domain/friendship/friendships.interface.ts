import { Friendship } from './friendship';
import { CreateFriendshipCandidate } from '../../usecases/friendship/candidates/create-friendship.candidate';

export interface Friendships {
  createFriendship(
    friendshipCandidate: CreateFriendshipCandidate,
  ): Promise<string>;

  findByUserId(userId: string): Promise<Friendship[]>;

  findById(id: string): Promise<Friendship>;

  removeFriendship(id: string): Promise<void>;
}
