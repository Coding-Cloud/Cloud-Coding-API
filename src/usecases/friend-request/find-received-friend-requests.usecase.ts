import { TypeormFriendRequestsRepository } from '../../infrastructure/repositories/repositories/typeorm-friend-requests.repository';
import { FriendRequest } from '../../domain/friend-request/friend-request';

export class FindReceivedFriendRequestsUseCase {
  constructor(
    private readonly friendRequests: TypeormFriendRequestsRepository,
  ) {}

  async findReceivedFriendRequests(userId: string): Promise<FriendRequest[]> {
    return this.friendRequests.findReceivedFriendRequests(userId);
  }
}
