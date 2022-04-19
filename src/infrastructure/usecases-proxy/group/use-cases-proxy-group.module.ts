import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { CreateGroupUseCase } from '../../../usecases/group/create-group.usecase';
import { TypeormGroupsRepository } from '../../repositories/repositories/typeorm-groups.repository';
import { UpdateGroupUseCase } from '../../../usecases/group/update-group.usecase';
import { DeleteGroupUseCase } from '../../../usecases/group/delete-group.usecase';
import { GetGroupUseCase } from '../../../usecases/group/get-group.usecase';
import { UseCasesProxyConversationModule } from '../conversation/use-cases-proxy-conversation.module';
import { CreateConversationUseCase } from '../../../usecases/conversation/create-conversation.usecase';
import { RemoveConversationUseCase } from '../../../usecases/conversation/remove-conversation.usecase';
import { FindOwnedGroupsUseCase } from '../../../usecases/group/find-owned-groups.usecase';

@Module({
  imports: [RepositoriesModule, UseCasesProxyConversationModule.register()],
})
export class UseCasesProxyGroupModule {
  static CREATE_GROUP_USE_CASES_PROXY = 'createGroupUseCaseProxy';
  static GET_GROUP_USE_CASES_PROXY = 'getGroupUseCaseProxy';
  static FIND_OWNED_GROUPS_USE_CASES_PROXY = 'findOwnedGroupsUseCaseProxy';
  static DELETE_GROUP_USE_CASES_PROXY = 'deleteGroupUseCaseProxy';
  static UPDATE_GROUP_USE_CASES_PROXY = 'updateGroupUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyGroupModule,
      providers: [
        {
          inject: [
            TypeormGroupsRepository,
            UseCasesProxyConversationModule.CREATE_CONVERSATION_USE_CASES_PROXY,
          ],
          provide: UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY,
          useFactory: (
            groups: TypeormGroupsRepository,
            createConversation: UseCaseProxy<CreateConversationUseCase>,
          ) =>
            new UseCaseProxy(
              new CreateGroupUseCase(groups, createConversation),
            ),
        },
        {
          inject: [TypeormGroupsRepository],
          provide: UseCasesProxyGroupModule.GET_GROUP_USE_CASES_PROXY,
          useFactory: (groups: TypeormGroupsRepository) =>
            new UseCaseProxy(new GetGroupUseCase(groups)),
        },
        {
          inject: [
            TypeormGroupsRepository,
            UseCasesProxyConversationModule.REMOVE_CONVERSATION_USE_CASES_PROXY,
          ],
          provide: UseCasesProxyGroupModule.DELETE_GROUP_USE_CASES_PROXY,
          useFactory: (
            groups: TypeormGroupsRepository,
            removeConversation: UseCaseProxy<RemoveConversationUseCase>,
          ) =>
            new UseCaseProxy(
              new DeleteGroupUseCase(groups, removeConversation),
            ),
        },
        {
          inject: [TypeormGroupsRepository],
          provide: UseCasesProxyGroupModule.UPDATE_GROUP_USE_CASES_PROXY,
          useFactory: (groups: TypeormGroupsRepository) =>
            new UseCaseProxy(new UpdateGroupUseCase(groups)),
        },
        {
          inject: [TypeormGroupsRepository],
          provide: UseCasesProxyGroupModule.FIND_OWNED_GROUPS_USE_CASES_PROXY,
          useFactory: (groups: TypeormGroupsRepository) =>
            new UseCaseProxy(new FindOwnedGroupsUseCase(groups)),
        },
      ],
      exports: [
        UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupModule.GET_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupModule.FIND_OWNED_GROUPS_USE_CASES_PROXY,
        UseCasesProxyGroupModule.DELETE_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupModule.UPDATE_GROUP_USE_CASES_PROXY,
      ],
    };
  }
}
