import { Groups } from '../../domain/group/groups.interface';
import { Inject } from '@nestjs/common';
import { UseCasesProxyConversationModule } from '../../infrastructure/usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { RemoveConversationUseCase } from '../conversation/remove-conversation.usecase';

export class DeleteGroupUseCase {
  constructor(
    private readonly groups: Groups,
    @Inject(UseCasesProxyConversationModule.REMOVE_CONVERSATION_USE_CASES_PROXY)
    private readonly removeConversation: UseCaseProxy<RemoveConversationUseCase>,
  ) {}

  async deleteGroup(id: string): Promise<void> {
    const group = await this.groups.findById(id);
    await this.removeConversation
      .getInstance()
      .removeConversation(group.conversationId);
    return await this.groups.deleteGroup(id);
  }
}
