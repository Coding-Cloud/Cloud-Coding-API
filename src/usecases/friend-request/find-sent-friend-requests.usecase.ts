import { TypeormFriendRequestsRepository } from '../../infrastructure/repositories/repositories/typeorm-friend-requests.repository';
import { FriendRequest } from '../../domain/friend-request/friend-request';

export class FindSentFriendRequestsUseCase {
  constructor(
    private readonly friendRequests: TypeormFriendRequestsRepository,
  ) {}

  async findSentFriendRequests(userId: string): Promise<FriendRequest[]> {
    return this.friendRequests.findSentFriendRequests(userId);
  }
}
