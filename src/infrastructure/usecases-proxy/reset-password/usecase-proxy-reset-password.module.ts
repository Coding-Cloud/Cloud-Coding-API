import { DynamicModule, Module } from '@nestjs/common';

import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { MailModule } from '../../notifications/mail/mail.module';
import { EncryptModule } from '../../encrypt/encrypt.module';
import { TypeormPasswordResetRespository } from '../../repositories/repositories/typeorm-password-reset.repository';
import { MailApi } from '../../notifications/mail/mail-api.abstract';
import { TypeormUsersRepository } from '../../repositories/repositories/typeorm-users.repository';
import { ResetPasswordUseCases } from '../../../usecases/auth/reset-password.usecase';
import { Encrypt } from '../../../domain/encrypt.interface';
import { ChangePasswordresetPasswordUseCases } from '../../../usecases/auth/change-password-reset-password.usecase';

@Module({
  imports: [RepositoriesModule, MailModule, EncryptModule],
})
export class UsecasesProxyResetPasswordModule {
  static CREATE_PASSWORD_RESET_USECASES_PROXY =
    'createPasswordResetUsecasesProxy';
  static VERIF_PASSWORD_RESET_USECASES_PROXY =
    'verifPasswordResetUsecasesProxy';
  static CHANGE_PASSWORD_RESET_PASSWORD_USECASES_PROXY =
    'ChangePAsswordResetPasswordUseCase';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyResetPasswordModule,
      providers: [
        {
          inject: [
            TypeormPasswordResetRespository,
            MailApi,
            TypeormUsersRepository,
          ],
          provide:
            UsecasesProxyResetPasswordModule.CREATE_PASSWORD_RESET_USECASES_PROXY,
          useFactory: (
            passwordResets: TypeormPasswordResetRespository,
            mailApi: MailApi,
            users: TypeormUsersRepository,
          ) =>
            new UseCaseProxy(
              new ResetPasswordUseCases(passwordResets, mailApi, users),
            ),
        },
        {
          inject: [TypeormPasswordResetRespository],
          provide:
            UsecasesProxyResetPasswordModule.VERIF_PASSWORD_RESET_USECASES_PROXY,
          useFactory: (
            passwordResets: TypeormPasswordResetRespository,
            mailApi: MailApi,
            users: TypeormUsersRepository,
          ) =>
            new UseCaseProxy(
              new ResetPasswordUseCases(passwordResets, mailApi, users),
            ),
        },
        {
          inject: [
            TypeormUsersRepository,
            Encrypt,
            TypeormPasswordResetRespository,
          ],
          provide:
            UsecasesProxyResetPasswordModule.CHANGE_PASSWORD_RESET_PASSWORD_USECASES_PROXY,
          useFactory: (
            users: TypeormUsersRepository,
            encrypt: Encrypt,
            passwordResets: TypeormPasswordResetRespository,
          ) =>
            new UseCaseProxy(
              new ChangePasswordresetPasswordUseCases(
                users,
                encrypt,
                passwordResets,
              ),
            ),
        },
      ],
      exports: [
        UsecasesProxyResetPasswordModule.CREATE_PASSWORD_RESET_USECASES_PROXY,
        UsecasesProxyResetPasswordModule.VERIF_PASSWORD_RESET_USECASES_PROXY,
        UsecasesProxyResetPasswordModule.CHANGE_PASSWORD_RESET_PASSWORD_USECASES_PROXY,
      ],
    };
  }
}
