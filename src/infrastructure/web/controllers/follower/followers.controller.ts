import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { Follower } from '../../../../domain/follower/follower';
import { UnfollowUserUseCase } from '../../../../usecases/follower/leave-project.usecase';
import { FindUserFollowingsUseCase } from '../../../../usecases/follower/find-followings.usecase';
import { FindUserFollowersUseCase } from '../../../../usecases/follower/find-followers.usecase';
import { FollowUserUseCase } from '../../../../usecases/follower/follow-user.usecase';
import { UseCasesProxyFollowerModule } from '../../../usecases-proxy/follower/use-cases-proxy-follower.module';

@Controller('followers')
@ApiTags('followers')
@UseGuards(AuthGuard)
export class FollowersController {
  constructor(
    @Inject(UseCasesProxyFollowerModule.FOLLOW_USER_USE_CASES_PROXY)
    private readonly followUser: UseCaseProxy<FollowUserUseCase>,
    @Inject(UseCasesProxyFollowerModule.UNFOLLOW_USER_USE_CASES_PROXY)
    private readonly unfollowUser: UseCaseProxy<UnfollowUserUseCase>,
    @Inject(UseCasesProxyFollowerModule.FIND_USER_FOLLOWINGS_USE_CASES_PROXY)
    private readonly findFollowings: UseCaseProxy<FindUserFollowingsUseCase>,
    @Inject(UseCasesProxyFollowerModule.FIND_USER_FOLLOWERS_USE_CASES_PROXY)
    private readonly findFollowers: UseCaseProxy<FindUserFollowersUseCase>,
  ) {}

  @Post('/:userId')
  follow(
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.followUser.getInstance().followUser(user.id, userId);
  }

  @Get('/followings/:userId')
  getFollowings(@Param('userId') userId: string): Promise<Follower[]> {
    return this.findFollowings.getInstance().findFollows(userId);
  }

  @Get('/followers/:userId')
  getFollowers(@Param('userId') userId: string): Promise<Follower[]> {
    return this.findFollowers.getInstance().findFollowers(userId);
  }

  @Delete('/:userId')
  unfollow(
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.unfollowUser.getInstance().unfollowUser(user.id, userId);
  }
}
