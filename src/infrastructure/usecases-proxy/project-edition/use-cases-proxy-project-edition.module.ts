import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { TypeormProjectsRepository } from '../../repositories/repositories/typeorm-projects.repository';
import { CodeRunnerModule } from '../../code-runner/code-runner.module';
import { StartProjectRunnerUseCase } from '../../../usecases/project-edition/start-project-runner.usecase';
import { StopProjectRunnerUseCase } from '../../../usecases/project-edition/stop-project-runner.usecase';
import { CodeRunnerApi } from '../../code-runner/code-runner-api.abstract';
import { EditProjectRunnerUseCase } from 'src/usecases/project-edition/edit-project-runner.usecase';
import { CodeWriter } from 'src/domain/code-writer.abstract';
import { CodeWriterModule } from 'src/infrastructure/code-writer/code-writer.module';

@Module({
  imports: [RepositoriesModule, CodeRunnerModule, CodeWriterModule],
})
export class UseCasesProxyProjectEditionModule {
  static START_PROJECT_RUNNER_USE_CASES_PROXY =
    'startProjectRunnerUseCaseProxy';
  static STOP_PROJECT_RUNNER_USE_CASES_PROXY = 'stopProjectRunnerUseCaseProxy';
  static EDIT_PROJECT_RUNNER_USE_CASES_PROXY = 'editProjectRunnerUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyProjectEditionModule,
      providers: [
        {
          inject: [TypeormProjectsRepository, CodeRunnerApi],
          provide:
            UseCasesProxyProjectEditionModule.START_PROJECT_RUNNER_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            codeRunnerApi: CodeRunnerApi,
          ) =>
            new UseCaseProxy(
              new StartProjectRunnerUseCase(projects, codeRunnerApi),
            ),
        },
        {
          inject: [TypeormProjectsRepository, CodeRunnerApi],
          provide:
            UseCasesProxyProjectEditionModule.STOP_PROJECT_RUNNER_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            codeRunnerApi: CodeRunnerApi,
          ) =>
            new UseCaseProxy(
              new StopProjectRunnerUseCase(projects, codeRunnerApi),
            ),
        },
        {
          inject: [CodeWriter],
          provide:
            UseCasesProxyProjectEditionModule.EDIT_PROJECT_RUNNER_USE_CASES_PROXY,
          useFactory: (codeWriter: CodeWriter) =>
            new UseCaseProxy(new EditProjectRunnerUseCase(codeWriter)),
        },
      ],
      exports: [
        UseCasesProxyProjectEditionModule.START_PROJECT_RUNNER_USE_CASES_PROXY,
        UseCasesProxyProjectEditionModule.STOP_PROJECT_RUNNER_USE_CASES_PROXY,
        UseCasesProxyProjectEditionModule.EDIT_PROJECT_RUNNER_USE_CASES_PROXY,
      ],
    };
  }
}
