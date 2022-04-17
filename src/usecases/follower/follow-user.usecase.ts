import { Logger } from '@nestjs/common';
import { TypeormFollowersRepository } from '../../infrastructure/repositories/repositories/typeorm-followers.repository';

export class FollowUserUseCase {
  constructor(private readonly followers: TypeormFollowersRepository) {}

  async followUser(followerId: string, followedId: string): Promise<void> {
    await this.followers.followUser(followerId, followedId);
    Logger.log(`User {${followerId}} followed {${followedId}}`);
  }
}
