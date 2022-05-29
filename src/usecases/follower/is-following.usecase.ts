import { Followers } from '../../domain/follower/followers.interface';

export class IsFollowingUseCase {
  constructor(private readonly followers: Followers) {}

  async isFollowing(followerId: string, followedId: string): Promise<boolean> {
    return this.followers.isFollowing(followerId, followedId);
  }
}
