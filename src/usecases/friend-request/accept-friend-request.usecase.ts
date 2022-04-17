import { TypeormFriendRequestsRepository } from '../../infrastructure/repositories/repositories/typeorm-friend-requests.repository';
import { Inject } from '@nestjs/common';
import { UseCasesProxyFriendshipModule } from '../../infrastructure/usecases-proxy/friendship/use-cases-proxy-friendship.module';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { CreateFriendshipUseCase } from '../friendship/create-friendship.usecase';

export class AcceptFriendRequestUseCase {
  constructor(
    private readonly friendRequests: TypeormFriendRequestsRepository,
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
    await this.createFriendship
      .getInstance()
      .createFriendship(requestedUserId, requesterUserId);
  }
}
