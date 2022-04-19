import { DynamicModule, Module } from '@nestjs/common';
import { Encrypt } from 'src/domain/encrypt.interface';
import { TypeormSessionsRespository } from 'src/infrastructure/repositories/repositories/typeorm-session.repository';
import { SignInUseCases } from 'src/usecases/auth/signin.usecase';
import { SignUpUseCases } from 'src/usecases/auth/signup.usecase';
import { getUserUseCases } from 'src/usecases/user/get-user.usecase';
import { EncryptModule } from '../../encrypt/encrypt.module';
import { JwtEncrypt } from '../../web/jwt/jwt-encrypt.abstract';
import { JwtEncryptModule } from '../../web/jwt/jwt-encrypt.module';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { TypeormUsersRepository } from '../../repositories/repositories/typeorm-users.repository';
import { UseCaseProxy } from '../usecases-proxy';

@Module({
  imports: [RepositoriesModule, EncryptModule, JwtEncryptModule],
})
export class UsecasesProxyUserModule {
  static SIGNIN_USECASES_PROXY = 'signinUsecasesProxy';
  static SIGNUP_USECASES_PROXY = 'signupUsecasesProxy';
  static GET_USER_USECASES_PROXY = 'getUserUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyUserModule,
      providers: [
        {
          inject: [
            TypeormUsersRepository,
            Encrypt,
            JwtEncrypt,
            TypeormSessionsRespository,
          ],
          provide: UsecasesProxyUserModule.SIGNIN_USECASES_PROXY,
          useFactory: (
            users: TypeormUsersRepository,
            encrypt: Encrypt,
            jwtEncrypt: JwtEncrypt,
            session: TypeormSessionsRespository,
          ) =>
            new UseCaseProxy(
              new SignInUseCases(users, encrypt, jwtEncrypt, session),
            ),
        },
        {
          inject: [TypeormUsersRepository],
          provide: UsecasesProxyUserModule.SIGNUP_USECASES_PROXY,
          useFactory: (users: TypeormUsersRepository) =>
            new UseCaseProxy(new SignUpUseCases(users)),
        },
        {
          inject: [TypeormUsersRepository],
          provide: UsecasesProxyUserModule.GET_USER_USECASES_PROXY,
          useFactory: (users: TypeormUsersRepository) =>
            new UseCaseProxy(new getUserUseCases(users)),
        },
      ],
      exports: [
        UsecasesProxyUserModule.SIGNIN_USECASES_PROXY,
        UsecasesProxyUserModule.SIGNUP_USECASES_PROXY,
        UsecasesProxyUserModule.GET_USER_USECASES_PROXY,
      ],
    };
  }
}
