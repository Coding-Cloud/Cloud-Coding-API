import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { TypeormFriendshipsRepository } from '../../repositories/repositories/typeorm-friendships.repository';
import { CreateFriendshipUseCase } from '../../../usecases/friendship/create-friendship.usecase';
import { FindFriendshipsUseCase } from '../../../usecases/friendship/find-friendships.usecase';
import { RemoveFriendshipUseCase } from '../../../usecases/friendship/remove-friendship.usecase';
import { UseCasesProxyConversationModule } from '../conversation/use-cases-proxy-conversation.module';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [RepositoriesModule, UseCasesProxyConversationModule.register()],
})
export class UseCasesProxyFriendshipModule {
  static CREATE_FRIENDSHIP_USE_CASES_PROXY = 'createFriendshipUseCaseProxy';
  static FIND_FRIENDSHIPS_USE_CASES_PROXY = 'findFriendshipsUseCaseProxy';
  static REMOVE_FRIENDSHIP_USE_CASES_PROXY = 'removeFriendshipUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyFriendshipModule,
      providers: [
        {
          inject: [TypeormFriendshipsRepository, EventEmitter2],
          provide:
            UseCasesProxyFriendshipModule.CREATE_FRIENDSHIP_USE_CASES_PROXY,
          useFactory: (
            friendships: TypeormFriendshipsRepository,
            eventEmitter: EventEmitter2,
          ) =>
            new UseCaseProxy(
              new CreateFriendshipUseCase(friendships, eventEmitter),
            ),
        },
        {
          inject: [
            TypeormFriendshipsRepository,
            UseCasesProxyConversationModule.REMOVE_CONVERSATION_USE_CASES_PROXY,
          ],
          provide:
            UseCasesProxyFriendshipModule.FIND_FRIENDSHIPS_USE_CASES_PROXY,
          useFactory: (friendships: TypeormFriendshipsRepository) =>
            new UseCaseProxy(new FindFriendshipsUseCase(friendships)),
        },
        {
          inject: [TypeormFriendshipsRepository, EventEmitter2],
          provide:
            UseCasesProxyFriendshipModule.REMOVE_FRIENDSHIP_USE_CASES_PROXY,
          useFactory: (
            friendships: TypeormFriendshipsRepository,
            eventEmitter: EventEmitter2,
          ) =>
            new UseCaseProxy(
              new RemoveFriendshipUseCase(friendships, eventEmitter),
            ),
        },
      ],
      exports: [
        UseCasesProxyFriendshipModule.CREATE_FRIENDSHIP_USE_CASES_PROXY,
        UseCasesProxyFriendshipModule.FIND_FRIENDSHIPS_USE_CASES_PROXY,
        UseCasesProxyFriendshipModule.REMOVE_FRIENDSHIP_USE_CASES_PROXY,
      ],
    };
  }
}
