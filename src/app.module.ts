import { Module } from '@nestjs/common';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { UsecasesProxyResetPasswordModule } from './infrastructure/usecases-proxy/reset-password/usecase-proxy-reset-password.module';
import { UsecasesProxySessionModule } from './infrastructure/usecases-proxy/session/usecase-proxy-session.module';
import { UsecasesProxyUserModule } from './infrastructure/usecases-proxy/user/usecases-proxy-user.module';
import { UseCasesProxyProjectModule } from './infrastructure/usecases-proxy/project/use-cases-proxy-project.module';

@Module({
  imports: [
    UsecasesProxySessionModule,
    UsecasesProxyUserModule,
    UsecasesProxyResetPasswordModule,
    UseCasesProxyProjectModule,
    ControllersModule,
  ],
})
export class AppModule {}
