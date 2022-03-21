import { DynamicModule, Module } from '@nestjs/common';
import { TypeormSessionsRespository } from 'src/infrastructure/repositories/repositories/typeorm-session.repository';
import { createSessionUseCases } from 'src/usecases/session/create-session.usecase';
import { RepositoriesModule } from '../../repositories/repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';

@Module({
  imports: [RepositoriesModule],
})
export class UsecasesProxySessionModule {
  static CREATE_SESSION_USECASES_PROXY = 'createSessionUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxySessionModule,
      providers: [
        {
          inject: [TypeormSessionsRespository],
          provide: UsecasesProxySessionModule.CREATE_SESSION_USECASES_PROXY,
          useFactory: (sessions: TypeormSessionsRespository) =>
            new UseCaseProxy(new createSessionUseCases(sessions)),
        },
      ],
      exports: [UsecasesProxySessionModule.CREATE_SESSION_USECASES_PROXY],
    };
  }
}
