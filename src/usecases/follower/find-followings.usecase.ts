import { TypeormFollowersRepository } from '../../infrastructure/repositories/repositories/typeorm-followers.repository';
import { Follower } from '../../domain/follower/follower';

export class FindUserFollowingsUseCase {
  constructor(private readonly followers: TypeormFollowersRepository) {}

  async findFollows(userId: string): Promise<Follower[]> {
    return await this.followers.findFollowsById(userId);
  }
}
