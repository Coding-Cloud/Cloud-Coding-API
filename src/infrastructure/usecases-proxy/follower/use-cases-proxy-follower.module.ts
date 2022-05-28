import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { FollowUserUseCase } from '../../../usecases/follower/follow-user.usecase';
import { TypeormFollowersRepository } from '../../repositories/repositories/typeorm-followers.repository';
import { UnfollowUserUseCase } from '../../../usecases/follower/leave-project.usecase';
import { FindUserFollowersUseCase } from '../../../usecases/follower/find-followers.usecase';
import { FindUserFollowingsUseCase } from '../../../usecases/follower/find-followings.usecase';
import { IsFollowingUseCase } from '../../../usecases/follower/is-following.usecase';

@Module({
  imports: [RepositoriesModule],
})
export class UseCasesProxyFollowerModule {
  static FOLLOW_USER_USE_CASES_PROXY = 'followUserUseCaseProxy';
  static UNFOLLOW_USER_USE_CASES_PROXY = 'unfollowUserUseCaseProxy';
  static FIND_USER_FOLLOWERS_USE_CASES_PROXY = 'findUserFollowersUseCaseProxy';
  static FIND_USER_FOLLOWINGS_USE_CASES_PROXY =
    'findUserFollowingsUseCaseProxy';
  static IS_FOLLOWING_USE_CASES_PROXY = 'isFollowingUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyFollowerModule,
      providers: [
        {
          inject: [TypeormFollowersRepository],
          provide: UseCasesProxyFollowerModule.FOLLOW_USER_USE_CASES_PROXY,
          useFactory: (followers: TypeormFollowersRepository) =>
            new UseCaseProxy(new FollowUserUseCase(followers)),
        },
        {
          inject: [TypeormFollowersRepository],
          provide: UseCasesProxyFollowerModule.UNFOLLOW_USER_USE_CASES_PROXY,
          useFactory: (followers: TypeormFollowersRepository) =>
            new UseCaseProxy(new UnfollowUserUseCase(followers)),
        },
        {
          inject: [TypeormFollowersRepository],
          provide:
            UseCasesProxyFollowerModule.FIND_USER_FOLLOWERS_USE_CASES_PROXY,
          useFactory: (followers: TypeormFollowersRepository) =>
            new UseCaseProxy(new FindUserFollowersUseCase(followers)),
        },
        {
          inject: [TypeormFollowersRepository],
          provide:
            UseCasesProxyFollowerModule.FIND_USER_FOLLOWINGS_USE_CASES_PROXY,
          useFactory: (followers: TypeormFollowersRepository) =>
            new UseCaseProxy(new FindUserFollowingsUseCase(followers)),
        },
        {
          inject: [TypeormFollowersRepository],
          provide: UseCasesProxyFollowerModule.IS_FOLLOWING_USE_CASES_PROXY,
          useFactory: (followers: TypeormFollowersRepository) =>
            new UseCaseProxy(new IsFollowingUseCase(followers)),
        },
      ],
      exports: [
        UseCasesProxyFollowerModule.FOLLOW_USER_USE_CASES_PROXY,
        UseCasesProxyFollowerModule.UNFOLLOW_USER_USE_CASES_PROXY,
        UseCasesProxyFollowerModule.FIND_USER_FOLLOWERS_USE_CASES_PROXY,
        UseCasesProxyFollowerModule.FIND_USER_FOLLOWINGS_USE_CASES_PROXY,
        UseCasesProxyFollowerModule.IS_FOLLOWING_USE_CASES_PROXY,
      ],
    };
  }
}
