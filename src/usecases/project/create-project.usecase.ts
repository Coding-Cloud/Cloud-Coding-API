import { Projects } from '../../domain/project/projects.interface';
import { ProjectInitialiserApi } from '../../infrastructure/project-initialiser/project-initialiser.abstract';
import { Inject, Logger } from '@nestjs/common';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { UseCasesProxyGroupModule } from '../../infrastructure/usecases-proxy/group/use-cases-proxy-group.module';
import { CreateGroupUseCase } from '../group/create-group.usecase';
import { Group } from '../../domain/group/group';
import { CreateProjectCandidate } from '../../infrastructure/repositories/candidates/project/create-project.candidate';

export class CreateProjectUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly projectInitialiserApi: ProjectInitialiserApi,
    @Inject(UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY)
    private readonly createGroup: UseCaseProxy<CreateGroupUseCase>,
  ) {}

  async createProject(
    projectCandidate: CreateProjectCandidate,
  ): Promise<string> {
    if (!projectCandidate.groupId) {
      Logger.log(
        `Creating a new group for the project ${projectCandidate.name}`,
      );
      projectCandidate.groupId = await this.groupCreation(
        projectCandidate.name,
        projectCandidate.creatorId,
      );
    }
    const projectId = await this.projects.createProject(projectCandidate);
    const subscription = this.projectInitialiserApi
      .initialiseProject(projectId, projectCandidate.language)
      .subscribe({
        next: () =>
          Logger.log(`Project {${projectId}} repository has been created`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
    return projectId;
  }

  private async groupCreation(
    name: string,
    creatorId: string,
  ): Promise<string> {
    const group = new Group();
    group.createdWithProject = true;
    group.name = name;
    group.ownerId = creatorId;
    return (await this.createGroup.getInstance().createGroup(group)).id;
  }
}
