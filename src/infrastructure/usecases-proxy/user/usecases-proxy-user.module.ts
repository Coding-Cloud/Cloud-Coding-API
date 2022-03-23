import { DynamicModule, Module } from '@nestjs/common';
import { Encrypt } from 'src/domain/encrypt.interface';
import { TypeormSessionsRespository } from 'src/infrastructure/repositories/repositories/typeorm-session.repository';
import { signInUseCases } from 'src/usecases/auth/signin.usecase';
import { signUpUseCases } from 'src/usecases/auth/signup.usecase';
import { EncryptModule } from '../../encrypt/encrypt.module';
import { JwtEncrypt } from '../../jwt/jwt-encrypt';
import { JwtEncryptModule } from '../../jwt/jwt-encrypt.module';
import { RepositoriesModule } from '../../repositories/repositories/repositories.module';
import { TypeormUsersRespository } from '../../repositories/repositories/typeorm-users.repository';
import { UseCaseProxy } from '../usecases-proxy';

@Module({
  imports: [RepositoriesModule, EncryptModule, JwtEncryptModule],
})
export class UsecasesProxyUserModule {
  static SIGNIN_USECASES_PROXY = 'signinUsecasesProxy';
  static SIGNUP_USECASES_PROXY = 'signupUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyUserModule,
      providers: [
        {
          inject: [
            TypeormUsersRespository,
            Encrypt,
            JwtEncrypt,
            TypeormSessionsRespository,
          ],
          provide: UsecasesProxyUserModule.SIGNIN_USECASES_PROXY,
          useFactory: (
            users: TypeormUsersRespository,
            encrypt: Encrypt,
            jwtEncrypt: JwtEncrypt,
            session: TypeormSessionsRespository,
          ) =>
            new UseCaseProxy(
              new signInUseCases(users, encrypt, jwtEncrypt, session),
            ),
        },
        {
          inject: [TypeormUsersRespository],
          provide: UsecasesProxyUserModule.SIGNUP_USECASES_PROXY,
          useFactory: (users: TypeormUsersRespository) =>
            new UseCaseProxy(new signUpUseCases(users)),
        },
      ],
      exports: [
        UsecasesProxyUserModule.SIGNIN_USECASES_PROXY,
        UsecasesProxyUserModule.SIGNUP_USECASES_PROXY,
      ],
    };
  }
}
