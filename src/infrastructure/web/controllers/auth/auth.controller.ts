import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
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

@Controller('auth')
@ApiTags('auth')
@ApiResponse({ status: 500, description: 'Internal error' })
export class AuthController {
  constructor(
    @Inject(UsecasesProxyUserModule.SIGNIN_USECASES_PROXY)
    private readonly signInUseCaseProxy: UseCaseProxy<SignInUseCases>,
    @Inject(UsecasesProxyUserModule.SIGNUP_USECASES_PROXY)
    private readonly signUpUseCaseProxy: UseCaseProxy<SignUpUseCases>,
  ) {}

  @Post('/signup')
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 403 })
  signUp(@Body() createUserDTO: CreateUserDTO): Promise<void> {
    console.log('je passe là');

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
