import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { TypeormProjectsRepository } from '../../repositories/repositories/typeorm-projects.repository';
import { CreateProjectUseCase } from '../../../usecases/project/create-project.usecase';
import { UpdateProjectUseCase } from '../../../usecases/project/update-project.usecase';
import { DeleteProjectUseCase } from '../../../usecases/project/delete-project.usecase';
import { InitialisedProjectUseCase } from '../../../usecases/project/initialised-project.usecase';
import { ProjectInitializerModule } from '../../project-initializer/project-initializer.module';
import { CodeRunnerModule } from '../../code-runner/code-runner.module';
import { ProjectInitializerApi } from '../../project-initializer/project-initializer.abstract';
import { HttpModule } from '@nestjs/axios';
import { ProjectVersioningModule } from '../../project-versioning/project-versioning.module';
import { CodeWriterModule } from 'src/infrastructure/code-writer/code-writer.module';
import { CodeWriter } from 'src/domain/code-writer.abstract';
import { ReadProjectUseCase } from 'src/usecases/project/read-project-file.usecase';
import { UseCasesProxyGroupModule } from '../group/use-cases-proxy-group.module';
import { CreateGroupUseCase } from '../../../usecases/group/create-group.usecase';
import { FindProjectUseCase } from '../../../usecases/project/find-project.usecase';
import { FindOwnedProjectsUseCase } from '../../../usecases/project/find-owned-projects.usecase';
import { FindGroupProjectsUseCase } from '../../../usecases/project/find-group-projects.usecase';
import { ChangeProjectGroupUseCase } from '../../../usecases/project/change-project-group.usecase';
import { DeleteHiddenGroupUseCase } from '../../../usecases/group/delete-hidden-group.usecase';
import { SetProjectHiddenGroupUseCase } from '../../../usecases/project/set-project-hidden-group.usecase';
import { FindMemberVisibleProjectUseCase } from '../../../usecases/project/find-visible-projects.usecase';
import { SearchUserProjectsUseCase } from '../../../usecases/project/search-user-projects.usecase';
import { ReadTreeStructureProjectUseCase } from '../../../usecases/project/read-tree-structure-project.usecase';
import { GetProjectFileContentUseCase } from 'src/usecases/project/get-project-file-content.usecase';
import { RemoveProjectFromGroupUseCase } from '../../../usecases/project/remove-project-from-group.usecase';
import { NameGeneratorModule } from '../../name-generator/name-generator.module';
import { NameGenerator } from '../../../domain/name-generator.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetPublicProjectsUseCase } from '../../../usecases/project/get-public-projects-use.case';
import { JoinedProjectsUseCase } from '../../../usecases/project/joined-projects.usecase';

@Module({
  imports: [
    RepositoriesModule,
    ProjectInitializerModule,
    ProjectVersioningModule,
    CodeRunnerModule,
    HttpModule,
    NameGeneratorModule,
    CodeWriterModule,
    UseCasesProxyGroupModule.register(),
  ],
})
export class UseCasesProxyProjectModule {
  static CREATE_PROJECT_USE_CASES_PROXY = 'createProjectUseCaseProxy';
  static FIND_PROJECT_USE_CASES_PROXY = 'findProjectUseCaseProxy';
  static FIND_OWNED_PROJECTS_USE_CASES_PROXY = 'findOwnedProjectsUseCaseProxy';
  static FIND_GROUP_PROJECTS_USE_CASES_PROXY = 'findGroupProjectsUseCaseProxy';
  static FIND_MEMBER_VISIBLE_PROJECTS_USE_CASES_PROXY =
    'findMemberVisibleProjectsUseCaseProxy';
  static FIND_JOINED_PROJECTS_USE_CASES_PROXY =
    'findJoinedProjectsUseCaseProxy';
  static GET_PUBLIC_PROJECTS_USER_CASE_PROXY = 'getPublicProjectsUseCaseProxy';
  static REMOVE_PROJECT_FROM_GROUP_USE_CASES_PROXY =
    'removeProjectFromGroupUseCaseProxy';
  static DELETE_PROJECT_USE_CASES_PROXY = 'deleteProjectUseCaseProxy';
  static SET_PROJECT_HIDDEN_GROUP_USE_CASES_PROXY =
    'setProjectHiddenGroupUseCaseProxy';
  static UPDATE_PROJECT_USE_CASES_PROXY = 'updateProjectUseCaseProxy';
  static CHANGE_PROJECT_GROUP_USE_CASES_PROXY =
    'changeProjectGroupUseCaseProxy';
  static INITIALISED_PROJECT_USE_CASES_PROXY = 'initialisedProjectUseCaseProxy';
  static READ_PROJECT_USE_CASES_PROXY = 'readProjectUseCaseProxy';
  static READ_TREE_STRUCTURE_PROJECT_USE_CASES_PROXY =
    'readTreeStructureProjectUseCaseProxy';
  static READ_PROJECT_FILE_USE_CASES_PROXY = 'readProjectFileUseCaseProxy';
  static SEARCH_USER_PROJECTS_USE_CASES_PROXY =
    'searchUserProjectsUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyProjectModule,
      providers: [
        {
          inject: [
            TypeormProjectsRepository,
            NameGenerator,
            ProjectInitializerApi,
            UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY,
          ],
          provide: UseCasesProxyProjectModule.CREATE_PROJECT_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            nameGenerator: NameGenerator,
            projectInitializerApi: ProjectInitializerApi,
            createGroup: UseCaseProxy<CreateGroupUseCase>,
          ) =>
            new UseCaseProxy(
              new CreateProjectUseCase(
                projects,
                nameGenerator,
                projectInitializerApi,
                createGroup,
              ),
            ),
        },
        {
          inject: [TypeormProjectsRepository],
          provide: UseCasesProxyProjectModule.FIND_PROJECT_USE_CASES_PROXY,
          useFactory: (projects: TypeormProjectsRepository) =>
            new UseCaseProxy(new FindProjectUseCase(projects)),
        },
        {
          inject: [TypeormProjectsRepository],
          provide:
            UseCasesProxyProjectModule.FIND_OWNED_PROJECTS_USE_CASES_PROXY,
          useFactory: (projects: TypeormProjectsRepository) =>
            new UseCaseProxy(new FindOwnedProjectsUseCase(projects)),
        },
        {
          inject: [TypeormProjectsRepository],
          provide:
            UseCasesProxyProjectModule.FIND_GROUP_PROJECTS_USE_CASES_PROXY,
          useFactory: (projects: TypeormProjectsRepository) =>
            new UseCaseProxy(new FindGroupProjectsUseCase(projects)),
        },
        {
          inject: [
            TypeormProjectsRepository,
            ProjectInitializerApi,
            EventEmitter2,
          ],
          provide: UseCasesProxyProjectModule.DELETE_PROJECT_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            projectInitializerApi: ProjectInitializerApi,
            eventEmitter: EventEmitter2,
          ) =>
            new UseCaseProxy(
              new DeleteProjectUseCase(
                projects,
                projectInitializerApi,
                eventEmitter,
              ),
            ),
        },
        {
          inject: [TypeormProjectsRepository],
          provide: UseCasesProxyProjectModule.UPDATE_PROJECT_USE_CASES_PROXY,
          useFactory: (projects: TypeormProjectsRepository) =>
            new UseCaseProxy(new UpdateProjectUseCase(projects)),
        },
        {
          inject: [
            TypeormProjectsRepository,
            UseCasesProxyGroupModule.DELETE_HIDDEN_GROUP_USE_CASES_PROXY,
          ],
          provide:
            UseCasesProxyProjectModule.CHANGE_PROJECT_GROUP_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            deleteHiddenGroup: UseCaseProxy<DeleteHiddenGroupUseCase>,
          ) =>
            new UseCaseProxy(
              new ChangeProjectGroupUseCase(projects, deleteHiddenGroup),
            ),
        },
        {
          inject: [TypeormProjectsRepository],
          provide:
            UseCasesProxyProjectModule.INITIALISED_PROJECT_USE_CASES_PROXY,
          useFactory: (projects: TypeormProjectsRepository) =>
            new UseCaseProxy(new InitialisedProjectUseCase(projects)),
        },
        {
          inject: [CodeWriter],
          provide: UseCasesProxyProjectModule.READ_PROJECT_USE_CASES_PROXY,
          useFactory: (codeWriter: CodeWriter) =>
            new UseCaseProxy(new ReadProjectUseCase(codeWriter)),
        },
        {
          inject: [CodeWriter],
          provide:
            UseCasesProxyProjectModule.READ_TREE_STRUCTURE_PROJECT_USE_CASES_PROXY,
          useFactory: (codeWriter: CodeWriter) =>
            new UseCaseProxy(new ReadTreeStructureProjectUseCase(codeWriter)),
        },
        {
          inject: [CodeWriter],
          provide: UseCasesProxyProjectModule.READ_PROJECT_FILE_USE_CASES_PROXY,
          useFactory: (codeWriter: CodeWriter) =>
            new UseCaseProxy(new GetProjectFileContentUseCase(codeWriter)),
        },
        {
          inject: [
            TypeormProjectsRepository,
            UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY,
          ],
          provide:
            UseCasesProxyProjectModule.SET_PROJECT_HIDDEN_GROUP_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            createGroup: UseCaseProxy<CreateGroupUseCase>,
          ) =>
            new UseCaseProxy(
              new SetProjectHiddenGroupUseCase(projects, createGroup),
            ),
        },
        {
          inject: [
            TypeormProjectsRepository,
            UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY,
          ],
          provide:
            UseCasesProxyProjectModule.REMOVE_PROJECT_FROM_GROUP_USE_CASES_PROXY,
          useFactory: (
            projects: TypeormProjectsRepository,
            createGroup: UseCaseProxy<CreateGroupUseCase>,
          ) =>
            new UseCaseProxy(
              new RemoveProjectFromGroupUseCase(projects, createGroup),
            ),
        },
        {
          inject: [TypeormProjectsRepository],
          provide:
            UseCasesProxyProjectModule.FIND_MEMBER_VISIBLE_PROJECTS_USE_CASES_PROXY,
          useFactory: (projects: TypeormProjectsRepository) =>
            new UseCaseProxy(new FindMemberVisibleProjectUseCase(projects)),
        },
        {
          inject: [TypeormProjectsRepository],
          provide:
            UseCasesProxyProjectModule.SEARCH_USER_PROJECTS_USE_CASES_PROXY,
          useFactory: (projects: TypeormProjectsRepository) =>
            new UseCaseProxy(new SearchUserProjectsUseCase(projects)),
        },
        {
          inject: [TypeormProjectsRepository],
          provide:
            UseCasesProxyProjectModule.GET_PUBLIC_PROJECTS_USER_CASE_PROXY,
          useFactory: (projects: TypeormProjectsRepository) =>
            new UseCaseProxy(new GetPublicProjectsUseCase(projects)),
        },
        {
          inject: [TypeormProjectsRepository],
          provide:
            UseCasesProxyProjectModule.FIND_JOINED_PROJECTS_USE_CASES_PROXY,
          useFactory: (projects: TypeormProjectsRepository) =>
            new UseCaseProxy(new JoinedProjectsUseCase(projects)),
        },
      ],
      exports: [
        UseCasesProxyProjectModule.CREATE_PROJECT_USE_CASES_PROXY,
        UseCasesProxyProjectModule.FIND_PROJECT_USE_CASES_PROXY,
        UseCasesProxyProjectModule.FIND_OWNED_PROJECTS_USE_CASES_PROXY,
        UseCasesProxyProjectModule.FIND_GROUP_PROJECTS_USE_CASES_PROXY,
        UseCasesProxyProjectModule.FIND_MEMBER_VISIBLE_PROJECTS_USE_CASES_PROXY,
        UseCasesProxyProjectModule.FIND_JOINED_PROJECTS_USE_CASES_PROXY,
        UseCasesProxyProjectModule.GET_PUBLIC_PROJECTS_USER_CASE_PROXY,
        UseCasesProxyProjectModule.DELETE_PROJECT_USE_CASES_PROXY,
        UseCasesProxyProjectModule.REMOVE_PROJECT_FROM_GROUP_USE_CASES_PROXY,
        UseCasesProxyProjectModule.UPDATE_PROJECT_USE_CASES_PROXY,
        UseCasesProxyProjectModule.SET_PROJECT_HIDDEN_GROUP_USE_CASES_PROXY,
        UseCasesProxyProjectModule.CHANGE_PROJECT_GROUP_USE_CASES_PROXY,
        UseCasesProxyProjectModule.INITIALISED_PROJECT_USE_CASES_PROXY,
        UseCasesProxyProjectModule.READ_PROJECT_USE_CASES_PROXY,
        UseCasesProxyProjectModule.READ_TREE_STRUCTURE_PROJECT_USE_CASES_PROXY,
        UseCasesProxyProjectModule.SEARCH_USER_PROJECTS_USE_CASES_PROXY,
        UseCasesProxyProjectModule.READ_PROJECT_FILE_USE_CASES_PROXY,
      ],
    };
  }
}
