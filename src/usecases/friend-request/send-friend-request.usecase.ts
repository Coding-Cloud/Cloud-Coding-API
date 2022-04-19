import { Logger } from '@nestjs/common';
import { FriendRequests } from '../../domain/friend-request/friend-requests.interface';

export class SendFriendRequestUseCase {
  constructor(private readonly friendRequests: FriendRequests) {}

  async sendFriendRequest(
    requesterUserId: string,
    requestedUserId: string,
  ): Promise<void> {
    await this.friendRequests.createFriendRequest(
      requesterUserId,
      requestedUserId,
    );
    Logger.log(
      `User {${requesterUserId}} requested friend {${requestedUserId}}`,
    );
  }
}
