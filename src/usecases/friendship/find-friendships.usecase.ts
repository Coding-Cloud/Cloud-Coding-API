import { TypeormFriendshipsRepository } from '../../infrastructure/repositories/repositories/typeorm-friendships.repository';
import { Friendship } from '../../domain/friendship/friendship';

export class FindFriendshipsUseCase {
  constructor(private readonly friendRequests: TypeormFriendshipsRepository) {}

  async findFriendships(userId: string): Promise<Friendship[]> {
    return this.friendRequests.findByUserId(userId);
  }
}
