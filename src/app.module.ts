import { Module } from '@nestjs/common';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { UsecasesProxySessionModule } from './infrastructure/usecases-proxy/session/usecase-proxy-session.module';
import { UsecasesProxyUserModule } from './infrastructure/usecases-proxy/user/usecases-proxy-user.module';

@Module({
  imports: [
    UsecasesProxyUserModule,
    UsecasesProxySessionModule,
    ControllersModule,
  ],
})
export class AppModule {}
