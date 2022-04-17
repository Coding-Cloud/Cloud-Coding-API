import { TypeormFriendRequestsRepository } from '../../infrastructure/repositories/repositories/typeorm-friend-requests.repository';

export class AcceptFriendRequestUseCase {
  constructor(
    private readonly friendRequests: TypeormFriendRequestsRepository,
  ) {}

  async acceptFriendRequest(
    requesterUserId: string,
    requestedUserId: string,
  ): Promise<void> {
    await this.friendRequests.deleteFriendRequest(
      requesterUserId,
      requestedUserId,
    );
  }
}
