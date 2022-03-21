import { Module } from '@nestjs/common';
import { UsecasesProxySessionModule } from '../usecases-proxy/session/usecase-proxy-session.module';
import { UsecasesProxyUserModule } from '../usecases-proxy/user/usecases-proxy-user.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    UsecasesProxyUserModule.register(),
    UsecasesProxySessionModule.register(),
  ],
  controllers: [AuthController],
})
export class ControllersModule {}
