import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { AcceptFriendRequestUseCase } from '../../../usecases/friend-request/accept-friend-request.usecase';
import { RejectFriendRequestUseCase } from '../../../usecases/friend-request/reject-friend-request.usecase';
import { SendFriendRequestUseCase } from '../../../usecases/friend-request/send-friend-request.usecase';
import { CancelFriendRequestUseCase } from '../../../usecases/friend-request/cancel-friend-request.usecase';
import { FindSentFriendRequestsUseCase } from '../../../usecases/friend-request/find-sent-friend-requests.usecase';
import { FindReceivedFriendRequestsUseCase } from '../../../usecases/friend-request/find-received-friend-requests.usecase';
import { TypeormFriendRequestsRepository } from '../../repositories/repositories/typeorm-friend-requests.repository';

@Module({
  imports: [RepositoriesModule],
})
export class UseCasesProxyFriendRequestModule {
  static ACCEPT_FRIEND_REQUEST_USE_CASES_PROXY = 'followUserUseCaseProxy';
  static REJECT_FRIEND_REQUEST_USE_CASES_PROXY = 'unfollowUserUseCaseProxy';
  static SEND_FRIEND_REQUEST_USE_CASES_PROXY = 'findUserFollowersUseCaseProxy';
  static CANCEL_FRIEND_REQUEST_USE_CASES_PROXY =
    'findUserFollowingsUseCaseProxy';
  static FIND_SENT_FRIEND_REQUEST_USE_CASES_PROXY = 'unfollowUserUseCaseProxy';
  static FIND_RECEIVED_FRIEND_REQUEST_USE_CASES_PROXY =
    'findUserFollowersUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyFriendRequestModule,
      providers: [
        {
          inject: [TypeormFriendRequestsRepository],
          provide:
            UseCasesProxyFriendRequestModule.ACCEPT_FRIEND_REQUEST_USE_CASES_PROXY,
          useFactory: (friendRequests: TypeormFriendRequestsRepository) =>
            new UseCaseProxy(new AcceptFriendRequestUseCase(friendRequests)),
        },
        {
          inject: [TypeormFriendRequestsRepository],
          provide:
            UseCasesProxyFriendRequestModule.REJECT_FRIEND_REQUEST_USE_CASES_PROXY,
          useFactory: (friendRequests: TypeormFriendRequestsRepository) =>
            new UseCaseProxy(new RejectFriendRequestUseCase(friendRequests)),
        },
        {
          inject: [TypeormFriendRequestsRepository],
          provide:
            UseCasesProxyFriendRequestModule.SEND_FRIEND_REQUEST_USE_CASES_PROXY,
          useFactory: (friendRequests: TypeormFriendRequestsRepository) =>
            new UseCaseProxy(new SendFriendRequestUseCase(friendRequests)),
        },
        {
          inject: [TypeormFriendRequestsRepository],
          provide:
            UseCasesProxyFriendRequestModule.CANCEL_FRIEND_REQUEST_USE_CASES_PROXY,
          useFactory: (friendRequests: TypeormFriendRequestsRepository) =>
            new UseCaseProxy(new CancelFriendRequestUseCase(friendRequests)),
        },
        {
          inject: [TypeormFriendRequestsRepository],
          provide:
            UseCasesProxyFriendRequestModule.FIND_SENT_FRIEND_REQUEST_USE_CASES_PROXY,
          useFactory: (friendRequests: TypeormFriendRequestsRepository) =>
            new UseCaseProxy(new FindSentFriendRequestsUseCase(friendRequests)),
        },
        {
          inject: [TypeormFriendRequestsRepository],
          provide:
            UseCasesProxyFriendRequestModule.FIND_RECEIVED_FRIEND_REQUEST_USE_CASES_PROXY,
          useFactory: (friendRequests: TypeormFriendRequestsRepository) =>
            new UseCaseProxy(
              new FindReceivedFriendRequestsUseCase(friendRequests),
            ),
        },
      ],
      exports: [
        UseCasesProxyFriendRequestModule.ACCEPT_FRIEND_REQUEST_USE_CASES_PROXY,
        UseCasesProxyFriendRequestModule.REJECT_FRIEND_REQUEST_USE_CASES_PROXY,
        UseCasesProxyFriendRequestModule.SEND_FRIEND_REQUEST_USE_CASES_PROXY,
        UseCasesProxyFriendRequestModule.CANCEL_FRIEND_REQUEST_USE_CASES_PROXY,
        UseCasesProxyFriendRequestModule.FIND_SENT_FRIEND_REQUEST_USE_CASES_PROXY,
        UseCasesProxyFriendRequestModule.FIND_RECEIVED_FRIEND_REQUEST_USE_CASES_PROXY,
      ],
    };
  }
}
