import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';
import { ProjectInitialiserApi } from '../../infrastructure/project-initialiser/project-initialiser.abstract';
import { Inject, Logger } from '@nestjs/common';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { UseCasesProxyGroupModule } from '../../infrastructure/usecases-proxy/group/use-cases-proxy-group.module';
import { CreateGroupUseCase } from '../group/create-group.usecase';
import { Group } from '../../domain/group/group';

export class CreateProjectUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly projectInitialiserApi: ProjectInitialiserApi,
    @Inject(UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY)
    private readonly createGroup: UseCaseProxy<CreateGroupUseCase>,
  ) {}

  async createProject(project: Project): Promise<Project> {
    if (!project.groupId) {
      Logger.log(`Creating a new group for the project ${project.name}`);
      project.groupId = await this.groupCreation(project.name);
    }
    await this.projects.createProject(project);
    const subscription = this.projectInitialiserApi
      .initialiseProject(project.id, project.language)
      .subscribe({
        next: () =>
          Logger.log(`Project {${project.id}} repository has been created`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
    return project;
  }

  private async groupCreation(name: string): Promise<string> {
    const group = new Group();
    group.createdWithProject = true;
    group.name = name;
    return (await this.createGroup.getInstance().createGroup(group)).id;
  }
}
