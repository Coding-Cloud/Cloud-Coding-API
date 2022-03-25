import { DynamicModule, Module } from '@nestjs/common';
import { Encrypt } from 'src/domain/encrypt.interface';
import { BcryptEncrypt } from 'src/infrastructure/encrypt/bcrypt-encrypt';
import { EncryptModule } from 'src/infrastructure/encrypt/encrypt.module';
import { MailApi } from 'src/infrastructure/mail/mail-api.abstract';
import { MailModule } from 'src/infrastructure/mail/mail.module';
import { TypeormPasswordResetRespository } from 'src/infrastructure/repositories/repositories/typeorm-password-reset.repository';
import { TypeormUsersRespository } from 'src/infrastructure/repositories/repositories/typeorm-users.repository';
import { ChangePasswordresetPasswordUseCases } from 'src/usecases/auth/change-password-reset-password.usecase';
import { ResetPasswordUseCases } from 'src/usecases/auth/reset-password.usecase';
import { RepositoriesModule } from '../../repositories/repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';

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
            TypeormUsersRespository,
          ],
          provide:
            UsecasesProxyResetPasswordModule.CREATE_PASSWORD_RESET_USECASES_PROXY,
          useFactory: (
            passwordResets: TypeormPasswordResetRespository,
            mailApi: MailApi,
            users: TypeormUsersRespository,
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
            users: TypeormUsersRespository,
          ) =>
            new UseCaseProxy(
              new ResetPasswordUseCases(passwordResets, mailApi, users),
            ),
        },
        {
          inject: [
            TypeormUsersRespository,
            Encrypt,
            TypeormPasswordResetRespository,
          ],
          provide:
            UsecasesProxyResetPasswordModule.CHANGE_PASSWORD_RESET_PASSWORD_USECASES_PROXY,
          useFactory: (
            users: TypeormUsersRespository,
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
