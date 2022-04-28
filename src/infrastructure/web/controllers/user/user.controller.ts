import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { UsecasesProxyUserModule } from '../../../usecases-proxy/user/usecases-proxy-user.module';
import { GetUserUseCases } from '../../../../usecases/user/get-user.usecase';
import { UserDto } from './dto/user-dto';
import { UsernameDto } from './dto/username-dto';
import { SearchUsersUseCases } from '../../../../usecases/user/search-users.usecase';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    @Inject(UsecasesProxyUserModule.GET_USER_USE_CASES_PROXY)
    private readonly getUserById: UseCaseProxy<GetUserUseCases>,
    @Inject(UsecasesProxyUserModule.SEARCH_USERS_USE_CASES_PROXY)
    private readonly searchUsers: UseCaseProxy<SearchUsersUseCases>,
  ) {}

  @ApiOperation({ summary: 'Get user by id' })
  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<UserDto> {
    const user = await this.getUserById.getInstance().getUserById(id);
    return {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      birthdate: user.birthdate,
      email: user.email,
    };
  }

  @ApiOperation({ summary: "Get a user's username by id" })
  @Get('/:id/name')
  async getUsername(@Param('id') id: string): Promise<UsernameDto> {
    return {
      username: (await this.getUserById.getInstance().getUserById(id)).username,
    };
  }

  @ApiOperation({ summary: 'Search for a user by email or name' })
  @Get('/search/:search')
  async search(@Param('search') search: string): Promise<UserDto[]> {
    const users = await this.searchUsers.getInstance().searchUsers(search);
    return users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        birthdate: user.birthdate,
        email: user.email,
      };
    });
  }
}
