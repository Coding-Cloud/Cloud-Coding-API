import { DynamicModule, Module } from '@nestjs/common';
import { TypeormSessionsRespository } from 'src/infrastructure/repositories/repositories/typeorm-session.repository';
import { CreateSessionUseCases } from 'src/usecases/session/create-session.usecase';
import { GetSessionUseCases } from 'src/usecases/session/get-session.usecase';
import { RepositoriesModule } from '../../repositories/repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';

@Module({
  imports: [RepositoriesModule],
})
export class UsecasesProxySessionModule {
  static CREATE_SESSION_USECASES_PROXY = 'createSessionUsecasesProxy';
  static GET_SESSION_USECASES_PROXY = 'getSessionUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxySessionModule,
      providers: [
        {
          inject: [TypeormSessionsRespository],
          provide: UsecasesProxySessionModule.CREATE_SESSION_USECASES_PROXY,
          useFactory: (sessions: TypeormSessionsRespository) =>
            new UseCaseProxy(new CreateSessionUseCases(sessions)),
        },
        {
          inject: [TypeormSessionsRespository],
          provide: UsecasesProxySessionModule.GET_SESSION_USECASES_PROXY,
          useFactory: (sessions: TypeormSessionsRespository) =>
            new UseCaseProxy(new GetSessionUseCases(sessions)),
        },
      ],
      exports: [
        UsecasesProxySessionModule.CREATE_SESSION_USECASES_PROXY,
        UsecasesProxySessionModule.GET_SESSION_USECASES_PROXY,
      ],
    };
  }
}
