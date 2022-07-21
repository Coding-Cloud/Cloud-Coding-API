import { GroupMemberships } from '../../domain/group-membership/group-memberships.interface';
import { Inject, Logger } from '@nestjs/common';
import { UseCasesProxyConversationModule } from '../../infrastructure/usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { UpdateGroupUseCase } from '../group/update-group.usecase';

export class JoinGroupUseCase {
  constructor(
    private readonly groupMemberships: GroupMemberships,
    @Inject(UseCasesProxyConversationModule.CREATE_CONVERSATION_USE_CASES_PROXY)
    private readonly updateGroup: UseCaseProxy<UpdateGroupUseCase>,
  ) {}

  async addUser(userId: string, groupId: string): Promise<void> {
    await this.updateGroup
      .getInstance()
      .updateGroupById(groupId, { isHidden: false });
    await this.groupMemberships.joinGroup(userId, groupId);
    Logger.log(`User {${userId}} joined group {${groupId}}`);
  }
}
