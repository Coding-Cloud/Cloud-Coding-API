import { Module } from '@nestjs/common';
import { UsecasesProxyResetPasswordModule } from '../../usecases-proxy/reset-password/usecase-proxy-reset-password.module';
import { UsecasesProxySessionModule } from '../../usecases-proxy/session/usecase-proxy-session.module';
import { UsecasesProxyUserModule } from '../../usecases-proxy/user/usecases-proxy-user.module';
import { AuthController } from './auth/auth.controller';
import { PasswordResetController } from './auth/password-reset.controller';
import { UseCasesProxyProjectModule } from '../../usecases-proxy/project/use-cases-proxy-project.module';
import { ProjectsController } from './project/projects.controller';
import { UseCasesProxyProjectVersioningModule } from '../../usecases-proxy/project-version/use-cases-proxy-project-version.module';
import { ProjectVersionsController } from './project-version/project-versions.controller';

@Module({
  imports: [
    UsecasesProxyUserModule.register(),
    UsecasesProxySessionModule.register(),
    UsecasesProxyResetPasswordModule.register(),
    UseCasesProxyProjectModule.register(),
    UseCasesProxyProjectVersioningModule.register(),
  ],
  controllers: [
    AuthController,
    PasswordResetController,
    ProjectsController,
    ProjectVersionsController,
  ],
})
export class ControllersModule {}
