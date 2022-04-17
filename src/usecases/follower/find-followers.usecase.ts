import { Follower } from '../../domain/follower/follower';
import { Followers } from '../../domain/follower/followers.interface';

export class FindUserFollowersUseCase {
  constructor(private readonly followers: Followers) {}

  async findFollowers(userId: string): Promise<Follower[]> {
    return this.followers.findFollowersById(userId);
  }
}
