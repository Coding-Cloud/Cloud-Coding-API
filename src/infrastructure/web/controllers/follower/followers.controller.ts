import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { UnfollowUserUseCase } from '../../../../usecases/follower/leave-project.usecase';
import { FindUserFollowingsUseCase } from '../../../../usecases/follower/find-followings.usecase';
import { FindUserFollowersUseCase } from '../../../../usecases/follower/find-followers.usecase';
import { FollowUserUseCase } from '../../../../usecases/follower/follow-user.usecase';
import { UseCasesProxyFollowerModule } from '../../../usecases-proxy/follower/use-cases-proxy-follower.module';
import { FollowerListDto } from './dto/follower-list.dto';
import { IsFollowingUseCase } from '../../../../usecases/follower/is-following.usecase';

@Controller('followers')
@ApiTags('followers')
@ApiSecurity('auth-token')
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
    @Inject(UseCasesProxyFollowerModule.IS_FOLLOWING_USE_CASES_PROXY)
    private readonly isFollowingUseCase: UseCaseProxy<IsFollowingUseCase>,
  ) {}

  @Post('/:userId')
  follow(
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.followUser.getInstance().followUser(user.id, userId);
  }

  @Get('/:userId/followings')
  async getFollowings(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<FollowerListDto> {
    const [followers, totalResults] = await this.findFollowings
      .getInstance()
      .findFollows(userId, limit, offset);
    return { followers, totalResults };
  }

  @Get('/:userId/followers')
  async getFollowers(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<FollowerListDto> {
    const [followers, totalResults] = await this.findFollowers
      .getInstance()
      .findFollowers(userId, limit, offset);
    return { followers, totalResults };
  }

  @Get('/:userId/is-following')
  async isFollowing(
    @GetUser() user: User,
    @Param('userId') userId: string,
  ): Promise<boolean> {
    return await this.isFollowingUseCase
      .getInstance()
      .isFollowing(user.id, userId);
  }

  @Delete('/:userId')
  unfollow(
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.unfollowUser.getInstance().unfollowUser(user.id, userId);
  }
}
