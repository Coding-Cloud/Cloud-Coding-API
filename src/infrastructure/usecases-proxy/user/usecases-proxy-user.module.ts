import { DynamicModule, Module } from '@nestjs/common';
import { Encrypt } from 'src/domain/encrypt.interface';
import { TypeormSessionsRepository } from 'src/infrastructure/repositories/repositories/typeorm-session.repository';
import { SignInUseCases } from 'src/usecases/auth/signin.usecase';
import { SignUpUseCases } from 'src/usecases/auth/signup.usecase';
import { GetUserUseCases } from 'src/usecases/user/get-user.usecase';
import { EncryptModule } from '../../encrypt/encrypt.module';
import { JwtEncrypt } from '../../web/jwt/jwt-encrypt.abstract';
import { JwtEncryptModule } from '../../web/jwt/jwt-encrypt.module';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { TypeormUsersRepository } from '../../repositories/repositories/typeorm-users.repository';
import { UseCaseProxy } from '../usecases-proxy';
import { SearchUsersUseCases } from '../../../usecases/user/search-users.usecase';
import { UpdateUserUseCases } from '../../../usecases/user/update-user.usecase';
import { UpdateUserPasswordUseCases } from '../../../usecases/user/update-user-password.usecase';
import { GetUsersUseCases } from '../../../usecases/user/get-users.usecase';
import { IsProjectMemberUseCase } from '../../../usecases/user/is-project-member.usecase';

@Module({
  imports: [RepositoriesModule, EncryptModule, JwtEncryptModule, EncryptModule],
})
export class UsecasesProxyUserModule {
  static SIGNIN_USE_CASES_PROXY = 'signinUseCasesProxy';
  static SIGNUP_USE_CASES_PROXY = 'signupUseCasesProxy';
  static GET_USER_USE_CASES_PROXY = 'getUserUseCasesProxy';
  static GET_USERS_USE_CASES_PROXY = 'getUsersUseCasesProxy';
  static UPDATE_USER_USE_CASES_PROXY = 'updateUserUseCasesProxy';
  static UPDATE_USER_PASSWORD_USE_CASES_PROXY =
    'updateUserPasswordUseCasesProxy';
  static SEARCH_USERS_USE_CASES_PROXY = 'searchUsersUseCasesProxy';
  static IS_PROJECT_MEMBER_USE_CASES_PROXY = 'isProjectMemberUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyUserModule,
      providers: [
        {
          inject: [
            TypeormUsersRepository,
            Encrypt,
            JwtEncrypt,
            TypeormSessionsRepository,
          ],
          provide: UsecasesProxyUserModule.SIGNIN_USE_CASES_PROXY,
          useFactory: (
            users: TypeormUsersRepository,
            encrypt: Encrypt,
            jwtEncrypt: JwtEncrypt,
            session: TypeormSessionsRepository,
          ) =>
            new UseCaseProxy(
              new SignInUseCases(users, encrypt, jwtEncrypt, session),
            ),
        },
        {
          inject: [TypeormUsersRepository],
          provide: UsecasesProxyUserModule.SIGNUP_USE_CASES_PROXY,
          useFactory: (users: TypeormUsersRepository) =>
            new UseCaseProxy(new SignUpUseCases(users)),
        },
        {
          inject: [TypeormUsersRepository],
          provide: UsecasesProxyUserModule.GET_USER_USE_CASES_PROXY,
          useFactory: (users: TypeormUsersRepository) =>
            new UseCaseProxy(new GetUserUseCases(users)),
        },
        {
          inject: [TypeormUsersRepository, Encrypt],
          provide: UsecasesProxyUserModule.UPDATE_USER_PASSWORD_USE_CASES_PROXY,
          useFactory: (users: TypeormUsersRepository, encrypt: Encrypt) =>
            new UseCaseProxy(new UpdateUserPasswordUseCases(users, encrypt)),
        },
        {
          inject: [TypeormUsersRepository],
          provide: UsecasesProxyUserModule.UPDATE_USER_USE_CASES_PROXY,
          useFactory: (users: TypeormUsersRepository) =>
            new UseCaseProxy(new UpdateUserUseCases(users)),
        },
        {
          inject: [TypeormUsersRepository],
          provide: UsecasesProxyUserModule.SEARCH_USERS_USE_CASES_PROXY,
          useFactory: (users: TypeormUsersRepository) =>
            new UseCaseProxy(new SearchUsersUseCases(users)),
        },
        {
          inject: [TypeormUsersRepository],
          provide: UsecasesProxyUserModule.GET_USERS_USE_CASES_PROXY,
          useFactory: (users: TypeormUsersRepository) =>
            new UseCaseProxy(new GetUsersUseCases(users)),
        },
        {
          inject: [TypeormUsersRepository],
          provide: UsecasesProxyUserModule.IS_PROJECT_MEMBER_USE_CASES_PROXY,
          useFactory: (users: TypeormUsersRepository) =>
            new UseCaseProxy(new IsProjectMemberUseCase(users)),
        },
      ],
      exports: [
        UsecasesProxyUserModule.SIGNIN_USE_CASES_PROXY,
        UsecasesProxyUserModule.SIGNUP_USE_CASES_PROXY,
        UsecasesProxyUserModule.GET_USER_USE_CASES_PROXY,
        UsecasesProxyUserModule.GET_USERS_USE_CASES_PROXY,
        UsecasesProxyUserModule.UPDATE_USER_PASSWORD_USE_CASES_PROXY,
        UsecasesProxyUserModule.UPDATE_USER_USE_CASES_PROXY,
        UsecasesProxyUserModule.SEARCH_USERS_USE_CASES_PROXY,
        UsecasesProxyUserModule.IS_PROJECT_MEMBER_USE_CASES_PROXY,
      ],
    };
  }
}
