import { Logger } from '@nestjs/common';
import { FriendRequests } from '../../domain/friend-request/friend-requests.interface';

export class RejectFriendRequestUseCase {
  constructor(private readonly friendRequests: FriendRequests) {}

  async rejectFriendRequest(
    requesterUserId: string,
    requestedUserId: string,
  ): Promise<void> {
    await this.friendRequests.deleteFriendRequest(
      requesterUserId,
      requestedUserId,
    );
    Logger.log(
      `User {${requestedUserId}} requested friend {${requesterUserId}}`,
    );
  }
}
