import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { TypeormProjectsRepository } from '../../repositories/repositories/typeorm-projects.repository';
import { CodeRunnerModule } from '../../code-runner/code-runner.module';
import { CreateProjectRunnerUsecase } from '../../../usecases/project-edition/create-project-runner.usecase';
import { StopProjectRunnerUseCase } from '../../../usecases/project-edition/stop-project-runner.usecase';
import { CodeRunnerApi } from '../../code-runner/code-runner-api.abstract';
import { EditProjectRunnerUseCase } from 'src/usecases/project-edition/edit-project-runner.usecase';
import { CodeWriter } from 'src/domain/code-writer.abstract';
import { CodeWriterModule } from 'src/infrastructure/code-writer/code-writer.module';
import { RenameProjectRunnerUseCase } from 'src/usecases/project-edition/rename-project-folder-runner.usecase';
import { DeleteProjectFolderRunnerUseCase } from 'src/usecases/project-edition/delete-project-folder.usecase';
import { CreateImageUseCase } from '../../../usecases/project-edition/create-image.usecase';
import { DependenciesProjectRunnerUseCase } from '../../../usecases/project-edition/dependencies-project-runner-use.case';
import { RestartProjectRunnerUseCase } from '../../../usecases/project-edition/restart-project-runner-use.case';

@Module({
  imports: [RepositoriesModule, CodeRunnerModule, CodeWriterModule],
})
export class UseCasesProxyProjectEditionModule {
  static CREATE_PROJECT_RUNNER_USE_CASES_PROXY =
    'createProjectRunnerUseCaseProxy';
  static STOP_PROJECT_RUNNER_USE_CASES_PROXY = 'stopProjectRunnerUseCaseProxy';
  static RESTART_PROJECT_RUNNER_USE_CASES_PROXY =
    'restartProjectRunnerUseCaseProxy';
  static DEPENDENCIES_PROJECT_RUNNER_USE_CASES_PROXY =
    'dependenciesProjectRunnerUseCaseProxy';
  static EDIT_PROJECT_RUNNER_USE_CASES_PROXY = 'editProjectRunnerUseCaseProxy';
  static RENAME_FOLDER_PROJECT_RUNNER_USE_CASES_PROXY =
    'renameFolderProjectRunnerUseCaseProxy';
  static DELETE_FOLDER_PROJECT_RUNNER_USE_CASES_PROXY =
    'deleteFolderProjectRunnerUseCaseProxy';
  static CREATE_IMAGE_USE_CASES_PROXY = 'createImageUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyProjectEditionModule,
      providers: [
        {
          inject: [TypeormProjectsRepository, CodeRunnerApi],
          provide:
            UseCasesProxyProjectEditionModule.CREATE_PROJECT_RUNNER_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            codeRunnerApi: CodeRunnerApi,
          ) =>
            new UseCaseProxy(
              new CreateProjectRunnerUsecase(projects, codeRunnerApi),
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
          inject: [TypeormProjectsRepository, CodeRunnerApi],
          provide:
            UseCasesProxyProjectEditionModule.RESTART_PROJECT_RUNNER_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            codeRunnerApi: CodeRunnerApi,
          ) =>
            new UseCaseProxy(
              new RestartProjectRunnerUseCase(projects, codeRunnerApi),
            ),
        },
        {
          inject: [TypeormProjectsRepository, CodeRunnerApi],
          provide:
            UseCasesProxyProjectEditionModule.DEPENDENCIES_PROJECT_RUNNER_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            codeRunnerApi: CodeRunnerApi,
          ) =>
            new UseCaseProxy(
              new DependenciesProjectRunnerUseCase(projects, codeRunnerApi),
            ),
        },
        {
          inject: [CodeWriter],
          provide:
            UseCasesProxyProjectEditionModule.EDIT_PROJECT_RUNNER_USE_CASES_PROXY,
          useFactory: (codeWriter: CodeWriter) =>
            new UseCaseProxy(new EditProjectRunnerUseCase(codeWriter)),
        },
        {
          inject: [CodeWriter],
          provide:
            UseCasesProxyProjectEditionModule.CREATE_IMAGE_USE_CASES_PROXY,
          useFactory: (codeWriter: CodeWriter) =>
            new UseCaseProxy(new CreateImageUseCase(codeWriter)),
        },
        {
          inject: [CodeWriter],
          provide:
            UseCasesProxyProjectEditionModule.RENAME_FOLDER_PROJECT_RUNNER_USE_CASES_PROXY,
          useFactory: (codeWriter: CodeWriter) =>
            new UseCaseProxy(new RenameProjectRunnerUseCase(codeWriter)),
        },
        {
          inject: [CodeWriter],
          provide:
            UseCasesProxyProjectEditionModule.DELETE_FOLDER_PROJECT_RUNNER_USE_CASES_PROXY,
          useFactory: (codeWriter: CodeWriter) =>
            new UseCaseProxy(new DeleteProjectFolderRunnerUseCase(codeWriter)),
        },
      ],
      exports: [
        UseCasesProxyProjectEditionModule.CREATE_PROJECT_RUNNER_USE_CASES_PROXY,
        UseCasesProxyProjectEditionModule.RESTART_PROJECT_RUNNER_USE_CASES_PROXY,
        UseCasesProxyProjectEditionModule.STOP_PROJECT_RUNNER_USE_CASES_PROXY,
        UseCasesProxyProjectEditionModule.DEPENDENCIES_PROJECT_RUNNER_USE_CASES_PROXY,
        UseCasesProxyProjectEditionModule.EDIT_PROJECT_RUNNER_USE_CASES_PROXY,
        UseCasesProxyProjectEditionModule.RENAME_FOLDER_PROJECT_RUNNER_USE_CASES_PROXY,
        UseCasesProxyProjectEditionModule.DELETE_FOLDER_PROJECT_RUNNER_USE_CASES_PROXY,
        UseCasesProxyProjectEditionModule.CREATE_IMAGE_USE_CASES_PROXY,
      ],
    };
  }
}
