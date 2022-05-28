import { Follower } from '../../domain/follower/follower';
import { Followers } from '../../domain/follower/followers.interface';

export class FindUserFollowersUseCase {
  constructor(private readonly followers: Followers) {}

  async findFollowers(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<[Follower[], number]> {
    return this.followers.findFollowersById(userId, limit, offset);
  }
}
