import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { UseCasesProxyConversationModule } from '../../../usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { FindConversationUseCase } from '../../../../usecases/conversation/find-conversation.usecase';
import { Conversation } from '../../../../domain/conversation/conversation';

@Controller('conversations')
@ApiTags('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(
    @Inject(UseCasesProxyConversationModule.FIND_CONVERSATION_USE_CASES_PROXY)
    private readonly findConversation: UseCaseProxy<FindConversationUseCase>,
  ) {}

  @Get('/:id')
  findById(@Param('id') id: string): Promise<Conversation> {
    return this.findConversation.getInstance().findConversation(id);
  }
}
