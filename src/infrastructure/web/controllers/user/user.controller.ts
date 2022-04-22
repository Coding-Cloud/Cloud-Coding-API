import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { UsecasesProxyUserModule } from '../../../usecases-proxy/user/usecases-proxy-user.module';
import { GetUserUseCases } from '../../../../usecases/user/get-user.usecase';
import { UserDto } from './dto/user-dto';

@Controller('projects-version')
@ApiTags('projects-version')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    @Inject(UsecasesProxyUserModule.GET_USER_USECASES_PROXY)
    private readonly getUserById: UseCaseProxy<GetUserUseCases>,
  ) {}

  @ApiResponse({ description: 'Get  user by id' })
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

  @ApiResponse({ description: "Get a user's username by id" })
  @Get('/:id/name')
  async getUsername(@Param('id') id: string): Promise<string> {
    return (await this.getUserById.getInstance().getUserById(id)).username;
  }
}
