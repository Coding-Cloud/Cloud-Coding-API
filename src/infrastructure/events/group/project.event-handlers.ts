import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UseCasesProxyProjectModule } from '../../usecases-proxy/project/use-cases-proxy-project.module';
import { SetProjectHiddenGroupUseCase } from '../../../usecases/project/set-project-hidden-group.usecase';

export class ProjectEventHandlers {
  constructor(
    @Inject(UseCasesProxyProjectModule.SET_PROJECT_HIDDEN_GROUP_USE_CASES_PROXY)
    private readonly setProjectHiddenGroup: UseCaseProxy<SetProjectHiddenGroupUseCase>,
  ) {}

  @OnEvent('group.deleted')
  async handleGroupDeleted(groupId: string) {
    await this.setProjectHiddenGroup
      .getInstance()
      .setProjectHiddenGroup(groupId);
  }
}
