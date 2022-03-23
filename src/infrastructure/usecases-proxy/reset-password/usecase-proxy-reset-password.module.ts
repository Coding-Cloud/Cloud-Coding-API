import { DynamicModule, Module } from '@nestjs/common';
import { TypeormPasswordResetRespository } from 'src/infrastructure/repositories/repositories/typeorm-password-reset.repository';
import { resetPasswordUseCases } from 'src/usecases/auth/reset-password.usecase';
import { RepositoriesModule } from '../../repositories/repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';

@Module({
  imports: [RepositoriesModule],
})
export class UsecasesProxyResetPasswordModule {
  static CREATE_PASSWORD_RESET_USECASES_PROXY =
    'createPasswordResetUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyResetPasswordModule,
      providers: [
        {
          inject: [TypeormPasswordResetRespository],
          provide:
            UsecasesProxyResetPasswordModule.CREATE_PASSWORD_RESET_USECASES_PROXY,
          useFactory: (passwordResets: TypeormPasswordResetRespository) =>
            new UseCaseProxy(new resetPasswordUseCases(passwordResets)),
        },
      ],
      exports: [
        UsecasesProxyResetPasswordModule.CREATE_PASSWORD_RESET_USECASES_PROXY,
      ],
    };
  }
}
