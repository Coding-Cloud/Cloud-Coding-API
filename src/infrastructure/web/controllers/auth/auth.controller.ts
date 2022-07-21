import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SignInUseCases } from 'src/usecases/auth/signin.usecase';
import { SignUpUseCases } from 'src/usecases/auth/signup.usecase';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { UsecasesProxyUserModule } from '../../../usecases-proxy/user/usecases-proxy-user.module';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { MeUserDto } from './dto/me-user.dto';
import { AuthGuard } from './auth.guards';
import { UseCasesProxySessionModule } from '../../../usecases-proxy/session/usecase-proxy-session.module';
import { DeleteSessionUseCases } from '../../../../usecases/session/delete-session.usecase';
import { UpdateUserUseCases } from '../../../../usecases/user/update-user.usecase';
import { UpdateUserPasswordUseCases } from '../../../../usecases/user/update-user-password.usecase';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdateUserCandidate } from '../../../../usecases/user/candidates/update-user.candidate';

@Controller('auth')
@ApiTags('auth')
@ApiSecurity('auth-token')
@ApiResponse({ status: 500, description: 'Internal error' })
export class AuthController {
  constructor(
    @Inject(UsecasesProxyUserModule.SIGNIN_USE_CASES_PROXY)
    private readonly signInUseCaseProxy: UseCaseProxy<SignInUseCases>,
    @Inject(UsecasesProxyUserModule.SIGNUP_USE_CASES_PROXY)
    private readonly signUpUseCaseProxy: UseCaseProxy<SignUpUseCases>,
    @Inject(UsecasesProxyUserModule.UPDATE_USER_PASSWORD_USE_CASES_PROXY)
    private readonly updateUserPasswordUseCaseProxy: UseCaseProxy<UpdateUserPasswordUseCases>,
    @Inject(UsecasesProxyUserModule.UPDATE_USER_USE_CASES_PROXY)
    private readonly updateUserUseCaseProxy: UseCaseProxy<UpdateUserUseCases>,
    @Inject(UseCasesProxySessionModule.DELETE_SESSION_USE_CASES_PROXY)
    private readonly logoutUseCaseProxy: UseCaseProxy<DeleteSessionUseCases>,
  ) {}

  @Post('/signup')
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 403 })
  signUp(@Body() createUserDTO: CreateUserDTO): Promise<void> {
    return this.signUpUseCaseProxy.getInstance().signUp(createUserDTO);
  }

  @Post('/signin')
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 403 })
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.signInUseCaseProxy
      .getInstance()
      .signIn(authCredentialsDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/logout')
  async logout(@Headers('authorization') token: string): Promise<void> {
    return await this.logoutUseCaseProxy
      .getInstance()
      .deleteSessionByToken(token);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async updateUser(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDTO,
  ): Promise<void> {
    const updateUserCandidate: UpdateUserCandidate = {
      username: updateUserDto.username,
      firstname: updateUserDto.firstname,
      lastname: updateUserDto.lastname,
      email: updateUserDto.email,
      birthdate: updateUserDto.birthdate,
    };
    await this.updateUserUseCaseProxy
      .getInstance()
      .updateUserById(user.id, updateUserCandidate);
  }

  @UseGuards(AuthGuard)
  @Patch('/password')
  async updateUserPassword(
    @GetUser() user: User,
    @Body('password') password: string,
  ): Promise<void> {
    await this.updateUserPasswordUseCaseProxy
      .getInstance()
      .updateUserPasswordById(user.id, password);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  getMe(@GetUser() user: User): MeUserDto {
    return {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      birthdate: user.birthdate,
      email: user.email,
    };
  }
}
