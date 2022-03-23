import { Module } from '@nestjs/common';
import { UsecasesProxyResetPasswordModule } from '../usecases-proxy/reset-password/usecase-proxy-reset-password.module';
import { UsecasesProxySessionModule } from '../usecases-proxy/session/usecase-proxy-session.module';
import { UsecasesProxyUserModule } from '../usecases-proxy/user/usecases-proxy-user.module';
import { AuthController } from './auth/auth.controller';
import { PasswordResetController } from './auth/password-reset.controller';

@Module({
  imports: [
    UsecasesProxyUserModule.register(),
    UsecasesProxySessionModule.register(),
    UsecasesProxyResetPasswordModule.register(),
  ],
  controllers: [AuthController, PasswordResetController],
})
export class ControllersModule {}
