import { Group } from '../../domain/group/group';
import { Groups } from '../../domain/group/groups.interface';
import { Inject } from '@nestjs/common';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { UseCasesProxyConversationModule } from '../../infrastructure/usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { CreateConversationUseCase } from '../conversation/create-conversation.usecase';
import { CreateGroupCandidate } from './candidates/create-group.candidate';

export class CreateGroupUseCase {
  constructor(
    private readonly groups: Groups,
    @Inject(UseCasesProxyConversationModule.CREATE_CONVERSATION_USE_CASES_PROXY)
    private readonly createConversation: UseCaseProxy<CreateConversationUseCase>,
  ) {}

  async createGroup(
    createGroupCandidate: CreateGroupCandidate,
  ): Promise<Group> {
    createGroupCandidate.conversationId = await this.createConversation
      .getInstance()
      .createConversation();
    return await this.groups.createGroup(createGroupCandidate);
  }
}
