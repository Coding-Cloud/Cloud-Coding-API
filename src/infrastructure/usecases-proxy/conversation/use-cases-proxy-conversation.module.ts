import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { TypeormConversationsRepository } from '../../repositories/repositories/typeorm-conversations.repository';
import { CreateConversationUseCase } from '../../../usecases/conversation/create-conversation.usecase';
import { FindConversationUseCase } from '../../../usecases/conversation/find-conversation.usecase';
import { RemoveConversationUseCase } from '../../../usecases/conversation/remove-conversation.usecase';

@Module({
  imports: [RepositoriesModule],
})
export class UseCasesProxyConversationModule {
  static CREATE_CONVERSATION_USE_CASES_PROXY = 'createConversationUseCaseProxy';
  static FIND_CONVERSATION_USE_CASES_PROXY = 'findConversationUseCaseProxy';
  static REMOVE_CONVERSATION_USE_CASES_PROXY = 'removeConversationUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyConversationModule,
      providers: [
        {
          inject: [TypeormConversationsRepository],
          provide:
            UseCasesProxyConversationModule.CREATE_CONVERSATION_USE_CASES_PROXY,
          useFactory: (conversations: TypeormConversationsRepository) =>
            new UseCaseProxy(new CreateConversationUseCase(conversations)),
        },
        {
          inject: [TypeormConversationsRepository],
          provide:
            UseCasesProxyConversationModule.FIND_CONVERSATION_USE_CASES_PROXY,
          useFactory: (conversations: TypeormConversationsRepository) =>
            new UseCaseProxy(new FindConversationUseCase(conversations)),
        },
        {
          inject: [TypeormConversationsRepository],
          provide:
            UseCasesProxyConversationModule.REMOVE_CONVERSATION_USE_CASES_PROXY,
          useFactory: (conversations: TypeormConversationsRepository) =>
            new UseCaseProxy(new RemoveConversationUseCase(conversations)),
        },
      ],
      exports: [
        UseCasesProxyConversationModule.CREATE_CONVERSATION_USE_CASES_PROXY,
        UseCasesProxyConversationModule.FIND_CONVERSATION_USE_CASES_PROXY,
        UseCasesProxyConversationModule.REMOVE_CONVERSATION_USE_CASES_PROXY,
      ],
    };
  }
}
