import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsecasesProxyResetPasswordModule } from 'src/infrastructure/usecases-proxy/reset-password/usecase-proxy-reset-password.module';
import { ResetPasswordUseCases } from 'src/usecases/auth/reset-password.usecase';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { PasswordResetCredentialsDTO } from './dto/password-reset-credentials.dto';
import { ChangePasswordresetPasswordUseCases } from 'src/usecases/auth/change-password-reset-password.usecase';
import { ChangePasswordPasswordResetDTO } from './dto/change-password-password-reset.dto';

@Controller('passwordReset')
@ApiTags('password-reset')
@ApiResponse({ status: 500, description: 'Internal error' })
export class PasswordResetController {
  constructor(
    @Inject(
      UsecasesProxyResetPasswordModule.CREATE_PASSWORD_RESET_USECASES_PROXY,
    )
    private readonly resetPasswordUseCaseProxy: UseCaseProxy<ResetPasswordUseCases>,
    @Inject(
      UsecasesProxyResetPasswordModule.CHANGE_PASSWORD_RESET_PASSWORD_USECASES_PROXY,
    )
    private readonly changePasswordresetPasswordUseCases: UseCaseProxy<ChangePasswordresetPasswordUseCases>,
  ) {}

  @Post('/')
  @ApiResponse({ status: 201 })
  resetPassword(
    @Body() passwordResetCredentialsDTO: PasswordResetCredentialsDTO,
  ): Promise<void> {
    return this.resetPasswordUseCaseProxy
      .getInstance()
      .reset(passwordResetCredentialsDTO.email);
  }

  @Get('/:token')
  @ApiResponse({ status: 201 })
  async verifToken(@Param('token') token: string): Promise<void> {
    if (
      (await this.resetPasswordUseCaseProxy
        .getInstance()
        .verifResetToken(token)) === false
    ) {
      throw new BadRequestException();
    }
  }

  @Put('/')
  @ApiResponse({ status: 201 })
  async passwordReset(
    @Body() changePasswordPasswordResetDTO: ChangePasswordPasswordResetDTO,
  ): Promise<void> {
    await this.changePasswordresetPasswordUseCases
      .getInstance()
      .change(
        changePasswordPasswordResetDTO.password,
        changePasswordPasswordResetDTO.token,
      );
  }
}
