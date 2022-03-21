import { Module } from '@nestjs/common';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { UsecasesProxyUserModule } from './infrastructure/usecases-proxy/user/usecases-proxy-user.module';

@Module({
  imports: [UsecasesProxyUserModule, ControllersModule],
})
export class AppModule {}
