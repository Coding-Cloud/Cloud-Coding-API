import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { TypeormProjectsRepository } from '../../repositories/repositories/typeorm-projects.repository';
import { ProjectInitialiserModule } from '../../project-initialiser/project-initialiser.module';
import { CodeRunnerModule } from '../../code-runner/code-runner.module';
import { HttpModule } from '@nestjs/axios';
import { AddProjectVersionUseCase } from '../../../usecases/project-version/add-project-version.usecase';
import { ProjectVersioningApi } from '../../project-versioning/project-versioning.abstract';
import { GetProjectVersionsUseCase } from '../../../usecases/project-version/get-project-versions.usecase';
import { RollbackProjectVersionUseCase } from '../../../usecases/project-version/rollback-project-version.usecase';
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
export class UseCasesProxyProjectVersioningModule {
  static ADD_PROJECT_VERSION_USE_CASES_PROXY = 'addProjectVersionUseCaseProxy';
  static GET_PROJECT_VERSIONS_USE_CASES_PROXY =
    'getProjectVersionsUseCaseProxy';
  static ROLLBACK_PROJECT_VERSION_USE_CASES_PROXY =
    'rollbackProjectVersionUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyProjectVersioningModule,
      providers: [
        {
          inject: [TypeormProjectsRepository, ProjectVersioningApi],
          provide:
            UseCasesProxyProjectVersioningModule.ADD_PROJECT_VERSION_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            projectVersioningApi: ProjectVersioningApi,
          ) =>
            new UseCaseProxy(
              new AddProjectVersionUseCase(projects, projectVersioningApi),
            ),
        },
        {
          inject: [TypeormProjectsRepository, ProjectVersioningApi],
          provide:
            UseCasesProxyProjectVersioningModule.GET_PROJECT_VERSIONS_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            projectVersioningApi: ProjectVersioningApi,
          ) =>
            new UseCaseProxy(
              new GetProjectVersionsUseCase(projects, projectVersioningApi),
            ),
        },
        {
          inject: [TypeormProjectsRepository, ProjectVersioningApi],
          provide:
            UseCasesProxyProjectVersioningModule.ROLLBACK_PROJECT_VERSION_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            projectVersioningApi: ProjectVersioningApi,
          ) =>
            new UseCaseProxy(
              new RollbackProjectVersionUseCase(projects, projectVersioningApi),
            ),
        },
      ],
      exports: [
        UseCasesProxyProjectVersioningModule.ADD_PROJECT_VERSION_USE_CASES_PROXY,
        UseCasesProxyProjectVersioningModule.GET_PROJECT_VERSIONS_USE_CASES_PROXY,
        UseCasesProxyProjectVersioningModule.ROLLBACK_PROJECT_VERSION_USE_CASES_PROXY,
      ],
    };
  }
}
