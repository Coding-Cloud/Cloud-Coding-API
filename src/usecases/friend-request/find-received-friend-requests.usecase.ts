import { FriendRequest } from '../../domain/friend-request/friend-request';
import { FriendRequests } from '../../domain/friend-request/friend-requests.interface';

export class FindReceivedFriendRequestsUseCase {
  constructor(private readonly friendRequests: FriendRequests) {}

  async findReceivedFriendRequests(userId: string): Promise<FriendRequest[]> {
    return this.friendRequests.findReceivedFriendRequests(userId);
  }
}
