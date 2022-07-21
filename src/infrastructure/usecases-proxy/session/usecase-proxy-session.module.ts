import { DynamicModule, Module } from '@nestjs/common';
import { TypeormSessionsRepository } from 'src/infrastructure/repositories/repositories/typeorm-session.repository';
import { CreateSessionUseCases } from 'src/usecases/session/create-session.usecase';
import { GetSessionUseCases } from 'src/usecases/session/get-session.usecase';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { DeleteSessionUseCases } from '../../../usecases/session/delete-session.usecase';

@Module({
  imports: [RepositoriesModule],
})
export class UseCasesProxySessionModule {
  static CREATE_SESSION_USE_CASES_PROXY = 'createSessionUseCasesProxy';
  static GET_SESSION_USE_CASES_PROXY = 'getSessionUseCasesProxy';
  static DELETE_SESSION_USE_CASES_PROXY = 'deleteSessionUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxySessionModule,
      providers: [
        {
          inject: [TypeormSessionsRepository],
          provide: UseCasesProxySessionModule.CREATE_SESSION_USE_CASES_PROXY,
          useFactory: (sessions: TypeormSessionsRepository) =>
            new UseCaseProxy(new CreateSessionUseCases(sessions)),
        },
        {
          inject: [TypeormSessionsRepository],
          provide: UseCasesProxySessionModule.GET_SESSION_USE_CASES_PROXY,
          useFactory: (sessions: TypeormSessionsRepository) =>
            new UseCaseProxy(new GetSessionUseCases(sessions)),
        },
        {
          inject: [TypeormSessionsRepository],
          provide: UseCasesProxySessionModule.DELETE_SESSION_USE_CASES_PROXY,
          useFactory: (sessions: TypeormSessionsRepository) =>
            new UseCaseProxy(new DeleteSessionUseCases(sessions)),
        },
      ],
      exports: [
        UseCasesProxySessionModule.CREATE_SESSION_USE_CASES_PROXY,
        UseCasesProxySessionModule.DELETE_SESSION_USE_CASES_PROXY,
        UseCasesProxySessionModule.GET_SESSION_USE_CASES_PROXY,
      ],
    };
  }
}
