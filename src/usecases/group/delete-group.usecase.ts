import { Groups } from '../../domain/group/groups.interface';
import { Inject } from '@nestjs/common';
import { UseCasesProxyConversationModule } from '../../infrastructure/usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { RemoveConversationUseCase } from '../conversation/remove-conversation.usecase';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class DeleteGroupUseCase {
  constructor(
    private readonly groups: Groups,
    @Inject(UseCasesProxyConversationModule.REMOVE_CONVERSATION_USE_CASES_PROXY)
    private readonly removeConversation: UseCaseProxy<RemoveConversationUseCase>,
    private eventEmitter: EventEmitter2,
  ) {}

  async deleteGroup(id: string): Promise<void> {
    const group = await this.groups.findById(id);
    this.eventEmitter.emit('group.deleted', id, group.isHidden);
    this.removeConversation
      .getInstance()
      .removeConversation(group.conversationId);
    return await this.groups.deleteGroup(id);
  }
}
