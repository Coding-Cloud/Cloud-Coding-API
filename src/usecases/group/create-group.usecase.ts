import { Group } from '../../domain/group/group';
import { Groups } from '../../domain/group/groups.interface';
import { Inject } from '@nestjs/common';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { UseCasesProxyConversationModule } from '../../infrastructure/usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { CreateConversationUseCase } from '../conversation/create-conversation.usecase';

export class CreateGroupUseCase {
  constructor(
    private readonly groups: Groups,
    @Inject(UseCasesProxyConversationModule.CREATE_CONVERSATION_USE_CASES_PROXY)
    private readonly createConversation: UseCaseProxy<CreateConversationUseCase>,
  ) {}

  async createGroup(group: Group): Promise<Group> {
    group.conversationId = await this.createConversation
      .getInstance()
      .createConversation();
    return await this.groups.createGroup(group);
  }
}
