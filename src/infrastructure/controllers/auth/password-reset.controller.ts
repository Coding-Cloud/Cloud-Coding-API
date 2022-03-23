import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guards';
import { Request } from 'express';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from 'src/domain/user/user';
import { UsecasesProxyResetPasswordModule } from 'src/infrastructure/usecases-proxy/reset-password/usecase-proxy-reset-password.module';
import { resetPasswordUseCases } from 'src/usecases/auth/reset-password.usecase';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';

@Controller('passwordReset')
@ApiTags('password-reset')
@UseGuards(AuthGuard)
@ApiResponse({ status: 500, description: 'Internal error' })
export class PasswordResetController {
  constructor(
    @Inject(
      UsecasesProxyResetPasswordModule.CREATE_PASSWORD_RESET_USECASES_PROXY,
    )
    private readonly resetPasswordUseCaseProxy: UseCaseProxy<resetPasswordUseCases>,
  ) {}

  @Post('/')
  @ApiResponse({ status: 201 })
  resetPassword(@GetUser() user: User): Promise<void> {
    return this.resetPasswordUseCaseProxy.getInstance().reset(user);
  }

  @Get('/:token')
  @ApiResponse({ status: 201 })
  async verifToken(
    @Param('token') token: string,
    @GetUser() user: User,
  ): Promise<void> {
    if (
      (await this.resetPasswordUseCaseProxy
        .getInstance()
        .verifResetToken(user, token)) === false
    ) {
      throw new BadRequestException();
    }
  }
}
