import { TypeormFriendshipsRepository } from '../../infrastructure/repositories/repositories/typeorm-friendships.repository';

export class CreateFriendshipUseCase {
  constructor(private readonly friendRequests: TypeormFriendshipsRepository) {}

  //TODO create conversation
  async createFriendship(user1Id: string, user2Id: string): Promise<string> {
    return await this.friendRequests.createFriendship(user1Id, user2Id);
  }
}
