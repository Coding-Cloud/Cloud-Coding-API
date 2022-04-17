import { TypeormFollowersRepository } from '../../infrastructure/repositories/repositories/typeorm-followers.repository';
import { Follower } from '../../domain/follower/follower';

export class FindUserFollowersUseCase {
  constructor(private readonly followers: TypeormFollowersRepository) {}

  async findFollowers(userId: string): Promise<Follower[]> {
    return this.followers.findFollowersById(userId);
  }
}
