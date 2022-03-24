import { DynamicModule, Module } from '@nestjs/common';
import { MailApi } from 'src/infrastructure/mail/mail-api.abstract';
import { MailModule } from 'src/infrastructure/mail/mail.module';
import { TypeormPasswordResetRespository } from 'src/infrastructure/repositories/repositories/typeorm-password-reset.repository';
import { resetPasswordUseCases } from 'src/usecases/auth/reset-password.usecase';
import { RepositoriesModule } from '../../repositories/repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';

@Module({
  imports: [RepositoriesModule, MailModule],
})
export class UsecasesProxyResetPasswordModule {
  static CREATE_PASSWORD_RESET_USECASES_PROXY =
    'createPasswordResetUsecasesProxy';
  static VERIF_PASSWORD_RESET_USECASES_PROXY =
    'verifPasswordResetUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyResetPasswordModule,
      providers: [
        {
          inject: [TypeormPasswordResetRespository, MailApi],
          provide:
            UsecasesProxyResetPasswordModule.CREATE_PASSWORD_RESET_USECASES_PROXY,
          useFactory: (
            passwordResets: TypeormPasswordResetRespository,
            mailApi: MailApi,
          ) =>
            new UseCaseProxy(
              new resetPasswordUseCases(passwordResets, mailApi),
            ),
        },
        {
          inject: [TypeormPasswordResetRespository],
          provide:
            UsecasesProxyResetPasswordModule.VERIF_PASSWORD_RESET_USECASES_PROXY,
          useFactory: (
            passwordResets: TypeormPasswordResetRespository,
            mailApi: MailApi,
          ) =>
            new UseCaseProxy(
              new resetPasswordUseCases(passwordResets, mailApi),
            ),
        },
      ],
      exports: [
        UsecasesProxyResetPasswordModule.CREATE_PASSWORD_RESET_USECASES_PROXY,
        UsecasesProxyResetPasswordModule.VERIF_PASSWORD_RESET_USECASES_PROXY,
      ],
    };
  }
}
