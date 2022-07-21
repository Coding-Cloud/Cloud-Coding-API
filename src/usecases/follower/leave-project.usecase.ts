import { Logger } from '@nestjs/common';
import { Followers } from '../../domain/follower/followers.interface';

export class UnfollowUserUseCase {
  constructor(private readonly followers: Followers) {}

  async unfollowUser(followerId: string, followedId: string): Promise<void> {
    await this.followers.unfollowUser(followerId, followedId);
    Logger.log(`User {${followerId}} unfollowed {${followedId}}`);
  }
}
