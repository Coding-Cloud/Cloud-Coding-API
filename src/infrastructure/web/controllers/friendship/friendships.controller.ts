import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { UseCasesProxyFriendshipModule } from '../../../usecases-proxy/friendship/use-cases-proxy-friendship.module';
import { FindFriendshipsUseCase } from '../../../../usecases/friendship/find-friendships.usecase';
import { RemoveFriendshipUseCase } from '../../../../usecases/friendship/remove-friendship.usecase';
import { Friendship } from '../../../../domain/friendship/friendship';

@Controller('friendships')
@ApiTags('friendships')
@UseGuards(AuthGuard)
export class FriendshipsController {
  constructor(
    @Inject(UseCasesProxyFriendshipModule.FIND_FRIENDSHIPS_USE_CASES_PROXY)
    private readonly findFriendships: UseCaseProxy<FindFriendshipsUseCase>,
    @Inject(UseCasesProxyFriendshipModule.REMOVE_FRIENDSHIP_USE_CASES_PROXY)
    private readonly removeFriendship: UseCaseProxy<RemoveFriendshipUseCase>,
  ) {}

  @Get()
  getFriendshipById(@GetUser() user: User): Promise<Friendship[]> {
    return this.findFriendships.getInstance().findFriendships(user.id);
  }

  @ApiOperation({ summary: 'Get the friendship of a user' })
  @Get('/:id')
  getUsersFriendship(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<Friendship> {
    return this.findFriendships.getInstance().findUsersFriendship(user.id, id);
  }

  @Get('/:id')
  getFriendships(@Param('id') id: string): Promise<Friendship> {
    return this.findFriendships.getInstance().findFriendshipById(id);
  }

  @Delete('/:id')
  deleteFriendship(@Param('id') id: string): Promise<void> {
    return this.removeFriendship.getInstance().removeFriendship(id);
  }
}
