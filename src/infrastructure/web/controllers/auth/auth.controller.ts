import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SignInUseCases } from 'src/usecases/auth/signin.usecase';
import { SignUpUseCases } from 'src/usecases/auth/signup.usecase';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { UsecasesProxyUserModule } from '../../../usecases-proxy/user/usecases-proxy-user.module';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { MeUserDto } from './dto/me-user.dto';
import { AuthGuard } from './auth.guards';
import { UseCasesProxySessionModule } from '../../../usecases-proxy/session/usecase-proxy-session.module';
import { DeleteSessionUseCases } from '../../../../usecases/session/delete-session.usecase';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({ status: 500, description: 'Internal error' })
export class AuthController {
  constructor(
    @Inject(UsecasesProxyUserModule.SIGNIN_USECASES_PROXY)
    private readonly signInUseCaseProxy: UseCaseProxy<SignInUseCases>,
    @Inject(UsecasesProxyUserModule.SIGNUP_USECASES_PROXY)
    private readonly signUpUseCaseProxy: UseCaseProxy<SignUpUseCases>,
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
