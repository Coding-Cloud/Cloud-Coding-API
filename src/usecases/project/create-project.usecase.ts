import { Projects } from '../../domain/project/projects.interface';
import { ProjectInitializerApi } from '../../infrastructure/project-initializer/project-initializer.abstract';
import { Inject, Logger } from '@nestjs/common';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { UseCasesProxyGroupModule } from '../../infrastructure/usecases-proxy/group/use-cases-proxy-group.module';
import { CreateGroupUseCase } from '../group/create-group.usecase';
import { CreateProjectCandidate } from './candidates/create-project.candidate';
import { CreateGroupCandidate } from '../group/candidates/create-group.candidate';
import { NameGenerator } from '../../domain/name-generator.interface';
import { ProjectLanguage } from '../../domain/project/project-language.enum';

export class CreateProjectUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly nameGenerator: NameGenerator,
    private readonly projectInitializerApi: ProjectInitializerApi,
    @Inject(UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY)
    private readonly createGroup: UseCaseProxy<CreateGroupUseCase>,
  ) {}

  async createProject(
    projectCandidate: CreateProjectCandidate,
  ): Promise<string> {
    projectCandidate.uniqueName = this.nameGenerator.generateName();
    if (!projectCandidate.groupId) {
      projectCandidate.groupId = await this.groupCreation(
        projectCandidate.name,
        projectCandidate.creatorId,
      );
    }
    const project = await this.projects.createProject(projectCandidate);
    this.initializeRepository(project.uniqueName, project.language);
    return project.id;
  }

  private initializeRepository(
    uniqueName: string,
    language: ProjectLanguage,
  ): void {
    const subscription = this.projectInitializerApi
      .initialiseProject(uniqueName, language)
      .subscribe({
        next: () =>
          Logger.log(`Project {${uniqueName}} repository has been created`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
  }

  private async groupCreation(name: string, ownerId: string): Promise<string> {
    Logger.log(`Creating a new group for the project ${name}`);
    const group: CreateGroupCandidate = {
      isHidden: true,
      name,
      ownerId,
    };

    return (await this.createGroup.getInstance().createGroup(group)).id;
  }
}
