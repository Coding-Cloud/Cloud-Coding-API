import { FriendRequest } from '../../domain/friend-request/friend-request';
import { FriendRequests } from '../../domain/friend-request/friend-requests.interface';

export class FindSentFriendRequestsUseCase {
  constructor(private readonly friendRequests: FriendRequests) {}

  async findSentFriendRequests(userId: string): Promise<FriendRequest[]> {
    return this.friendRequests.findSentFriendRequests(userId);
  }
}
