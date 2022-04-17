import { Follower } from '../../domain/follower/follower';
import { Followers } from '../../domain/follower/followers.interface';

export class FindUserFollowingsUseCase {
  constructor(private readonly followers: Followers) {}

  async findFollows(userId: string): Promise<Follower[]> {
    return await this.followers.findFollowsById(userId);
  }
}
