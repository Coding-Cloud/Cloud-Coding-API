import { Logger } from '@nestjs/common';
import { TypeormFollowersRepository } from '../../infrastructure/repositories/repositories/typeorm-followers.repository';

export class UnfollowUserUseCase {
  constructor(private readonly followers: TypeormFollowersRepository) {}

  async unfollowUser(followerId: string, followedId: string): Promise<void> {
    await this.followers.unfollowUser(followerId, followedId);
    Logger.log(`User {${followerId}} unfollowed {${followedId}}`);
  }
}
