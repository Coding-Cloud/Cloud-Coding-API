import { FriendRequest } from '../../domain/friend-request/friend-request';
import { FriendRequests } from '../../domain/friend-request/friend-requests.interface';

export class FindFriendRequestUseCase {
  constructor(private readonly friendRequests: FriendRequests) {}

  async findFriendRequests(
    user1Id: string,
    user2Id: string,
  ): Promise<FriendRequest> {
    return this.friendRequests.findFriendRequests(user1Id, user2Id);
  }
}
