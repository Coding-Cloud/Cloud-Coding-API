import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { UsecasesProxyUserModule } from '../../../usecases-proxy/user/usecases-proxy-user.module';
import { GetUserUseCases } from '../../../../usecases/user/get-user.usecase';
import { UserDto } from './dto/user-dto';
import { UsernameDto } from './dto/username-dto';
import { SearchUsersUseCases } from '../../../../usecases/user/search-users.usecase';
import { GetUsersUseCases } from '../../../../usecases/user/get-users.usecase';
import { UserList } from './dto/user-list.dto';

@Controller('users')
@ApiTags('users')
@ApiSecurity('auth-token')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    @Inject(UsecasesProxyUserModule.GET_USER_USE_CASES_PROXY)
    private readonly getUserById: UseCaseProxy<GetUserUseCases>,
    @Inject(UsecasesProxyUserModule.SEARCH_USERS_USE_CASES_PROXY)
    private readonly searchUsers: UseCaseProxy<SearchUsersUseCases>,
    @Inject(UsecasesProxyUserModule.GET_USERS_USE_CASES_PROXY)
    private readonly getUsers: UseCaseProxy<GetUsersUseCases>,
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

  @ApiOperation({ summary: 'Get a paginated list of users' })
  @ApiQuery({
    name: 'search',
    type: String,
    description: 'Data concerning the user to search',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
  })
  @Get('/')
  async getAll(
    @Query('search') search: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<UserList> {
    const [users, totalResults] = await this.getUsers
      .getInstance()
      .getUsers(search, limit, offset);
    return {
      totalResults,
      users: users.map((user) => {
        return {
          id: user.id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          birthdate: user.birthdate,
          email: user.email,
        };
      }),
    };
  }
}
