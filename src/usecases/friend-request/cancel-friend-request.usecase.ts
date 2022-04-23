import { Logger } from '@nestjs/common';
import { FriendRequests } from '../../domain/friend-request/friend-requests.interface';

export class CancelFriendRequestUseCase {
  constructor(private readonly friendRequests: FriendRequests) {}

  async cancelFriendRequest(
    requesterUserId: string,
    requestedUserId: string,
  ): Promise<void> {
    await this.friendRequests.deleteFriendRequest(
      requesterUserId,
      requestedUserId,
    );
    Logger.log(
      `User {${requesterUserId}} canceled friend request for {${requestedUserId}}`,
    );
  }
}
