import { Projects } from '../../domain/project/projects.interface';
import { UpdateProjectCandidate } from './candidates/update-project.candidate';
import { Inject, Logger } from '@nestjs/common';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { UseCasesProxyGroupModule } from '../../infrastructure/usecases-proxy/group/use-cases-proxy-group.module';
import { DeleteHiddenGroupUseCase } from '../group/delete-hidden-group.usecase';

export class ChangeProjectGroupUseCase {
  constructor(
    private readonly projects: Projects,
    @Inject(UseCasesProxyGroupModule.DELETE_HIDDEN_GROUP_USE_CASES_PROXY)
    private readonly deleteHiddenGroup: UseCaseProxy<DeleteHiddenGroupUseCase>,
  ) {}

  async changeProjectGroup(projectId: string, groupId: string): Promise<void> {
    Logger.log(`Changing project ${projectId} group for ${groupId}`);
    const project = await this.projects.findBy({ id: projectId });

    await this.deleteHiddenGroup
      .getInstance()
      .deleteHiddenGroup(project.groupId);
    const updateProject: UpdateProjectCandidate = {
      groupId,
    };
    return this.projects.updateProjectById(projectId, updateProject);
  }
}
