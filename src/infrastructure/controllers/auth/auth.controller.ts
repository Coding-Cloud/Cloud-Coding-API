import { Body, Controller, Inject, Post } from '@nestjs/common';
import { signInUseCases } from 'src/usecases/auth/signin.usecase';
import { signUpUseCases } from 'src/usecases/auth/signup.usecase';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyUserModule } from '../../usecases-proxy/user/usecases-proxy-user.module';
import { ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('auth')
@ApiResponse({ status: 500, description: 'Internal error' })
export class AuthController {
  constructor(
    @Inject(UsecasesProxyUserModule.SIGNIN_USECASES_PROXY)
    private readonly signInUseCaseProxy: UseCaseProxy<signInUseCases>,
    @Inject(UsecasesProxyUserModule.SIGNUP_USECASES_PROXY)
    private readonly signUpUseCaseProxy: UseCaseProxy<signUpUseCases>,
  ) {}

  @Post('/signup')
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 403 })
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.signUpUseCaseProxy.getInstance().signUp(authCredentialsDto);
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
}
