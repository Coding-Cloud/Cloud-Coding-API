import { Logger } from '@nestjs/common';
import { TypeormFriendRequestsRepository } from '../../infrastructure/repositories/repositories/typeorm-friend-requests.repository';

export class CancelFriendRequestUseCase {
  constructor(
    private readonly friendRequests: TypeormFriendRequestsRepository,
  ) {}

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
