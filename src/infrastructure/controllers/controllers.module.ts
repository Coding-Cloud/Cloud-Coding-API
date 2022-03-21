import { Module } from '@nestjs/common';
import { UsecasesProxyUserModule } from '../usecases-proxy/user/usecases-proxy-user.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [UsecasesProxyUserModule.register()],
  controllers: [AuthController],
})
export class ControllersModule {}
