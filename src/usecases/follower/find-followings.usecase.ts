import { Follower } from '../../domain/follower/follower';
import { Followers } from '../../domain/follower/followers.interface';

export class FindUserFollowingsUseCase {
  constructor(private readonly followers: Followers) {}

  async findFollows(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<[Follower[], number]> {
    return await this.followers.findFollowsById(userId, limit, offset);
  }
}
