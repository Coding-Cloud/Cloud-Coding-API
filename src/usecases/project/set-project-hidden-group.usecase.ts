import { Projects } from '../../domain/project/projects.interface';
import { Inject, Logger } from '@nestjs/common';
import { CreateGroupCandidate } from '../group/candidates/create-group.candidate';
import { UseCasesProxyGroupModule } from '../../infrastructure/usecases-proxy/group/use-cases-proxy-group.module';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { CreateGroupUseCase } from '../group/create-group.usecase';

export class SetProjectHiddenGroupUseCase {
  constructor(
    private readonly projects: Projects,
    @Inject(UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY)
    private readonly createGroup: UseCaseProxy<CreateGroupUseCase>,
  ) {}

  async setProjectHiddenGroup(groupId: string): Promise<void> {
    const projects = await this.projects.findByGroupId(groupId);
    for (const project of projects) {
      Logger.log(`Project {${project.id}} changed to hidden group`);
      await this.projects.updateProjectById(project.id, {
        groupId: await this.groupCreation(project.name, project.creatorId),
      });
    }
  }

  private async groupCreation(name: string, ownerId: string): Promise<string> {
    const group: CreateGroupCandidate = {
      isHidden: true,
      name,
      ownerId,
    };

    return (await this.createGroup.getInstance().createGroup(group)).id;
  }
}
