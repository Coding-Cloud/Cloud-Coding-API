import { TypeormFriendRequestsRepository } from '../../infrastructure/repositories/repositories/typeorm-friend-requests.repository';
import { Logger } from '@nestjs/common';

export class RejectFriendRequestUseCase {
  constructor(
    private readonly friendRequests: TypeormFriendRequestsRepository,
  ) {}

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
