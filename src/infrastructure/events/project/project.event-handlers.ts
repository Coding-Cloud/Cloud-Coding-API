import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UseCasesProxyProjectModule } from '../../usecases-proxy/project/use-cases-proxy-project.module';
import { SetProjectHiddenGroupUseCase } from '../../../usecases/project/set-project-hidden-group.usecase';
import { UseCasesProxyGroupModule } from '../../usecases-proxy/group/use-cases-proxy-group.module';
import { GetGroupUseCase } from '../../../usecases/group/get-group.usecase';

export class ProjectEventHandlers {
  constructor(
    @Inject(UseCasesProxyProjectModule.SET_PROJECT_HIDDEN_GROUP_USE_CASES_PROXY)
    private readonly setProjectHiddenGroup: UseCaseProxy<SetProjectHiddenGroupUseCase>,
    @Inject(UseCasesProxyGroupModule.GET_GROUP_USE_CASES_PROXY)
    private readonly getGroupUseCase: UseCaseProxy<GetGroupUseCase>,
  ) {}

  @OnEvent('group.deleted')
  async handleGroupDeleted(groupId: string) {
    const group = await this.getGroupUseCase.getInstance().getGroup(groupId);
    if (!group.isHidden) {
      await this.setProjectHiddenGroup
        .getInstance()
        .setProjectHiddenGroup(groupId);
    }
  }
}
