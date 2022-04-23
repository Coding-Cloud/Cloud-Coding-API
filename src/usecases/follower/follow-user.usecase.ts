import { Logger } from '@nestjs/common';
import { Followers } from '../../domain/follower/followers.interface';

export class FollowUserUseCase {
  constructor(private readonly followers: Followers) {}

  async followUser(followerId: string, followedId: string): Promise<void> {
    await this.followers.followUser(followerId, followedId);
    Logger.log(`User {${followerId}} followed {${followedId}}`);
  }
}
