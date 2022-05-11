import { Inject } from '@nestjs/common';
import { UseCasesProxyProjectModule } from '../../usecases-proxy/project/use-cases-proxy-project.module';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { OnEvent } from '@nestjs/event-emitter';
import { FindProjectUseCase } from '../../../usecases/project/find-project.usecase';
import { UseCasesProxyGroupModule } from '../../usecases-proxy/group/use-cases-proxy-group.module';
import { DeleteHiddenGroupUseCase } from '../../../usecases/group/delete-hidden-group.usecase';

export class GroupEventHandlers {
  constructor(
    @Inject(UseCasesProxyProjectModule.FIND_PROJECT_USE_CASES_PROXY)
    private readonly findProjectUseCase: UseCaseProxy<FindProjectUseCase>,
    @Inject(UseCasesProxyGroupModule.DELETE_HIDDEN_GROUP_USE_CASES_PROXY)
    private readonly deleteHiddenGroupUseCase: UseCaseProxy<DeleteHiddenGroupUseCase>,
  ) {}

  @OnEvent('project.deleted')
  async handleGroupDeleted(id: string) {
    const project = await this.findProjectUseCase
      .getInstance()
      .findProjectBy({ id });
    await this.deleteHiddenGroupUseCase
      .getInstance()
      .deleteHiddenGroup(project.groupId);
  }
}
