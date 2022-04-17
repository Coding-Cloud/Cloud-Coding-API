import { Logger } from '@nestjs/common';
import { TypeormFriendRequestsRepository } from '../../infrastructure/repositories/repositories/typeorm-friend-requests.repository';

export class SendFriendRequestUseCase {
  constructor(
    private readonly friendRequests: TypeormFriendRequestsRepository,
  ) {}

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
