import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { TypeormProjectsRepository } from '../../repositories/repositories/typeorm-projects.repository';
import { CreateProjectUseCase } from '../../../usecases/project/create-project.usecase';
import { UpdateProjectUseCase } from '../../../usecases/project/update-project-use.case';
import { DeleteProjectUseCase } from '../../../usecases/project/delete-project.usecase';
import { InitialisedProjectUseCase } from '../../../usecases/project/initialised-project.usecase';
import { ProjectInitialiserModule } from '../../project-initialiser/project-initialiser.module';
import { CodeRunnerModule } from '../../code-runner/code-runner.module';
import { ProjectInitialiserApi } from '../../project-initialiser/project-initialiser.abstract';
import { HttpModule } from '@nestjs/axios';
import { ProjectVersioningModule } from '../../project-versioning/project-versioning.module';

@Module({
  imports: [
    RepositoriesModule,
    ProjectInitialiserModule,
    ProjectVersioningModule,
    CodeRunnerModule,
    HttpModule,
  ],
})
export class UseCasesProxyProjectModule {
  static CREATE_PROJECT_USE_CASES_PROXY = 'createProjectUseCaseProxy';
  static DELETE_PROJECT_USE_CASES_PROXY = 'deleteProjectUseCaseProxy';
  static UPDATE_PROJECT_USE_CASES_PROXY = 'updateProjectUseCaseProxy';
  static INITIALISED_PROJECT_USE_CASES_PROXY = 'initialisedProjectUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyProjectModule,
      providers: [
        {
          inject: [TypeormProjectsRepository, ProjectInitialiserApi],
          provide: UseCasesProxyProjectModule.CREATE_PROJECT_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            projectInitialiserApi: ProjectInitialiserApi,
          ) =>
            new UseCaseProxy(
              new CreateProjectUseCase(projects, projectInitialiserApi),
            ),
        },
        {
          inject: [TypeormProjectsRepository, ProjectInitialiserApi],
          provide: UseCasesProxyProjectModule.DELETE_PROJECT_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            projectInitialiserApi: ProjectInitialiserApi,
          ) =>
            new UseCaseProxy(
              new DeleteProjectUseCase(projects, projectInitialiserApi),
            ),
        },
        {
          inject: [TypeormProjectsRepository],
          provide: UseCasesProxyProjectModule.UPDATE_PROJECT_USE_CASES_PROXY,
          useFactory: (projects: TypeormProjectsRepository) =>
            new UseCaseProxy(new UpdateProjectUseCase(projects)),
        },
        {
          inject: [TypeormProjectsRepository],
          provide:
            UseCasesProxyProjectModule.INITIALISED_PROJECT_USE_CASES_PROXY,
          useFactory: (projects: TypeormProjectsRepository) =>
            new UseCaseProxy(new InitialisedProjectUseCase(projects)),
        },
      ],
      exports: [
        UseCasesProxyProjectModule.CREATE_PROJECT_USE_CASES_PROXY,
        UseCasesProxyProjectModule.DELETE_PROJECT_USE_CASES_PROXY,
        UseCasesProxyProjectModule.UPDATE_PROJECT_USE_CASES_PROXY,
        UseCasesProxyProjectModule.INITIALISED_PROJECT_USE_CASES_PROXY,
      ],
    };
  }
}
