import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { CreateGroupUseCase } from '../../../usecases/group/create-group.usecase';
import { TypeormGroupsRepository } from '../../repositories/repositories/typeorm-groups.repository';
import { UpdateGroupUseCase } from '../../../usecases/group/update-group.usecase';
import { DeleteGroupUseCase } from '../../../usecases/group/delete-group.usecase';
import { GetGroupUseCase } from '../../../usecases/group/get-group.usecase';
import { UseCasesProxyConversationModule } from '../conversation/use-cases-proxy-conversation.module';
import { FindOwnedGroupsUseCase } from '../../../usecases/group/find-owned-groups.usecase';
import { FindUserGroupsUseCase } from '../../../usecases/group/find-user-groups-use.case';
import { DeleteHiddenGroupUseCase } from '../../../usecases/group/delete-hidden-group.usecase';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [RepositoriesModule, UseCasesProxyConversationModule.register()],
})
export class UseCasesProxyGroupModule {
  static CREATE_GROUP_USE_CASES_PROXY = 'createGroupUseCaseProxy';
  static GET_GROUP_USE_CASES_PROXY = 'getGroupUseCaseProxy';
  static FIND_OWNED_GROUPS_USE_CASES_PROXY = 'findOwnedGroupsUseCaseProxy';
  static FIND_MEMBER_GROUPS_USE_CASES_PROXY = 'findMemberGroupsUseCaseProxy';
  static DELETE_HIDDEN_GROUP_USE_CASES_PROXY = 'deleteHiddenGroupUseCaseProxy';
  static DELETE_GROUP_USE_CASES_PROXY = 'deleteGroupUseCaseProxy';
  static UPDATE_GROUP_USE_CASES_PROXY = 'updateGroupUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyGroupModule,
      providers: [
        {
          inject: [TypeormGroupsRepository, EventEmitter2],
          provide: UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY,
          useFactory: (
            groups: TypeormGroupsRepository,
            eventEmitter: EventEmitter2,
          ) => new UseCaseProxy(new CreateGroupUseCase(groups, eventEmitter)),
        },
        {
          inject: [TypeormGroupsRepository],
          provide: UseCasesProxyGroupModule.GET_GROUP_USE_CASES_PROXY,
          useFactory: (groups: TypeormGroupsRepository) =>
            new UseCaseProxy(new GetGroupUseCase(groups)),
        },
        {
          inject: [TypeormGroupsRepository, EventEmitter2],
          provide: UseCasesProxyGroupModule.DELETE_GROUP_USE_CASES_PROXY,
          useFactory: (
            groups: TypeormGroupsRepository,
            eventEmitter: EventEmitter2,
          ) => new UseCaseProxy(new DeleteGroupUseCase(groups, eventEmitter)),
        },
        {
          inject: [
            TypeormGroupsRepository,
            UseCasesProxyGroupModule.DELETE_GROUP_USE_CASES_PROXY,
          ],
          provide: UseCasesProxyGroupModule.DELETE_HIDDEN_GROUP_USE_CASES_PROXY,
          useFactory: (
            groups: TypeormGroupsRepository,
            deleteGroup: UseCaseProxy<DeleteGroupUseCase>,
          ) =>
            new UseCaseProxy(new DeleteHiddenGroupUseCase(groups, deleteGroup)),
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
        {
          inject: [TypeormGroupsRepository],
          provide: UseCasesProxyGroupModule.FIND_MEMBER_GROUPS_USE_CASES_PROXY,
          useFactory: (groups: TypeormGroupsRepository) =>
            new UseCaseProxy(new FindUserGroupsUseCase(groups)),
        },
      ],
      exports: [
        UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupModule.GET_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupModule.FIND_OWNED_GROUPS_USE_CASES_PROXY,
        UseCasesProxyGroupModule.FIND_MEMBER_GROUPS_USE_CASES_PROXY,
        UseCasesProxyGroupModule.FIND_MEMBER_GROUPS_USE_CASES_PROXY,
        UseCasesProxyGroupModule.DELETE_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupModule.DELETE_HIDDEN_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupModule.UPDATE_GROUP_USE_CASES_PROXY,
      ],
    };
  }
}
