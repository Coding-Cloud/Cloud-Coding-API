import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { TypeormUserSocketsRepository } from '../../repositories/repositories/typeorm-user-socket.repository';
import { AddUserSocketUseCases } from '../../../usecases/user-socket/add-user-socket.usecases';
import { DeleteUserSocketUseCases } from '../../../usecases/user-socket/delete-user-socket.usecases';
import { FindUserSocketUseCases } from '../../../usecases/user-socket/find-user-socket.usecases';

@Module({
  imports: [RepositoriesModule],
})
export class UseCasesProxyUserSocketModule {
  static ADD_USER_SOCKET_USE_CASES_PROXY = 'addUserSocketUseCasesProxy';
  static DELETE_USER_SOCKET_USE_CASES_PROXY = 'deleteUserSocketUseCasesProxy';
  static FIND_USER_SOCKET_USE_CASES_PROXY = 'findUserSocketUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyUserSocketModule,
      providers: [
        {
          inject: [TypeormUserSocketsRepository],
          provide:
            UseCasesProxyUserSocketModule.ADD_USER_SOCKET_USE_CASES_PROXY,
          useFactory: (userSockets: TypeormUserSocketsRepository) =>
            new UseCaseProxy(new AddUserSocketUseCases(userSockets)),
        },
        {
          inject: [TypeormUserSocketsRepository],
          provide:
            UseCasesProxyUserSocketModule.DELETE_USER_SOCKET_USE_CASES_PROXY,
          useFactory: (userSockets: TypeormUserSocketsRepository) =>
            new UseCaseProxy(new DeleteUserSocketUseCases(userSockets)),
        },
        {
          inject: [TypeormUserSocketsRepository],
          provide:
            UseCasesProxyUserSocketModule.FIND_USER_SOCKET_USE_CASES_PROXY,
          useFactory: (userSockets: TypeormUserSocketsRepository) =>
            new UseCaseProxy(new FindUserSocketUseCases(userSockets)),
        },
      ],
      exports: [
        UseCasesProxyUserSocketModule.ADD_USER_SOCKET_USE_CASES_PROXY,
        UseCasesProxyUserSocketModule.DELETE_USER_SOCKET_USE_CASES_PROXY,
        UseCasesProxyUserSocketModule.FIND_USER_SOCKET_USE_CASES_PROXY,
      ],
    };
  }
}
