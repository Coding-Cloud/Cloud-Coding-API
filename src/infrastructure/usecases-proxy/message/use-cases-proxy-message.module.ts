import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { CreateMessageUseCase } from '../../../usecases/message/create-message.usecase';
import { DeleteMessageUseCase } from '../../../usecases/message/delete-message.usecase';
import { UseCasesProxyConversationModule } from '../conversation/use-cases-proxy-conversation.module';
import { TypeormMessagesRepository } from '../../repositories/repositories/typeorm-messages.repository';
import { FindConversationMessagesUseCase } from '../../../usecases/message/find-conversation-messages.usecase';
import { FindMessageUseCase } from '../../../usecases/message/find-message.usecase';

@Module({
  imports: [RepositoriesModule, UseCasesProxyConversationModule.register()],
})
export class UseCasesProxyMessageModule {
  static CREATE_MESSAGE_USE_CASES_PROXY = 'createMessageUseCaseProxy';
  static FIND_CONVERSATION_MESSAGES_USE_CASES_PROXY =
    'getConversationMessagesUseCaseProxy';
  static FIND_MESSAGE_USE_CASES_PROXY = 'findMessageUseCaseProxy';
  static DELETE_MESSAGE_USE_CASES_PROXY = 'deleteMessageUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyMessageModule,
      providers: [
        {
          inject: [TypeormMessagesRepository],
          provide: UseCasesProxyMessageModule.CREATE_MESSAGE_USE_CASES_PROXY,
          useFactory: (messages: TypeormMessagesRepository) =>
            new UseCaseProxy(new CreateMessageUseCase(messages)),
        },
        {
          inject: [TypeormMessagesRepository],
          provide: UseCasesProxyMessageModule.FIND_MESSAGE_USE_CASES_PROXY,
          useFactory: (messages: TypeormMessagesRepository) =>
            new UseCaseProxy(new FindMessageUseCase(messages)),
        },
        {
          inject: [TypeormMessagesRepository],
          provide:
            UseCasesProxyMessageModule.FIND_CONVERSATION_MESSAGES_USE_CASES_PROXY,
          useFactory: (messages: TypeormMessagesRepository) =>
            new UseCaseProxy(new FindConversationMessagesUseCase(messages)),
        },
        {
          inject: [TypeormMessagesRepository],
          provide: UseCasesProxyMessageModule.DELETE_MESSAGE_USE_CASES_PROXY,
          useFactory: (messages: TypeormMessagesRepository) =>
            new UseCaseProxy(new DeleteMessageUseCase(messages)),
        },
      ],
      exports: [
        UseCasesProxyMessageModule.CREATE_MESSAGE_USE_CASES_PROXY,
        UseCasesProxyMessageModule.FIND_MESSAGE_USE_CASES_PROXY,
        UseCasesProxyMessageModule.FIND_CONVERSATION_MESSAGES_USE_CASES_PROXY,
        UseCasesProxyMessageModule.DELETE_MESSAGE_USE_CASES_PROXY,
      ],
    };
  }
}
