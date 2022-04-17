import { Inject } from '@nestjs/common';
import { UseCasesProxyFriendshipModule } from '../../infrastructure/usecases-proxy/friendship/use-cases-proxy-friendship.module';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { CreateFriendshipUseCase } from '../friendship/create-friendship.usecase';
import { FriendRequests } from '../../domain/friend-request/friend-requests.interface';
import { Friendship } from '../../domain/friendship/friendship';

export class AcceptFriendRequestUseCase {
  constructor(
    private readonly friendRequests: FriendRequests,
    @Inject(UseCasesProxyFriendshipModule.CREATE_FRIENDSHIP_USE_CASES_PROXY)
    private readonly createFriendship: UseCaseProxy<CreateFriendshipUseCase>,
  ) {}

  async acceptFriendRequest(
    requesterUserId: string,
    requestedUserId: string,
  ): Promise<void> {
    await this.friendRequests.deleteFriendRequest(
      requesterUserId,
      requestedUserId,
    );
    const friendship = new Friendship();
    friendship.user1Id = requestedUserId;
    friendship.user2Id = requesterUserId;
    await this.createFriendship.getInstance().createFriendship(friendship);
  }
}
