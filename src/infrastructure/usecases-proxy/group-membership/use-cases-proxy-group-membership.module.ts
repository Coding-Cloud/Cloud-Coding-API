import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { TypeormGroupMembershipsRepository } from '../../repositories/repositories/typeorm-group-memberships.repository';
import { JoinGroupUseCase } from '../../../usecases/group-membership/join-group.usecase';
import { LeaveGroupUseCase } from '../../../usecases/group-membership/leave-project.usecase';
import { FindUserGroupsUseCase } from '../../../usecases/group-membership/find-user-groups.usecase';
import { FindGroupMembersUseCase } from '../../../usecases/group-membership/find-group-members.usecase';
import { UseCasesProxyGroupModule } from '../group/use-cases-proxy-group.module';
import { UpdateGroupUseCase } from '../../../usecases/group/update-group.usecase';
import { UpdateGroupMembershipUseCase } from '../../../usecases/group-membership/update-group-membership.usecase';

@Module({
  imports: [RepositoriesModule, UseCasesProxyGroupModule.register()],
})
export class UseCasesProxyGroupMembershipModule {
  static JOIN_GROUP_USE_CASES_PROXY = 'joinGroupUseCaseProxy';
  static LEAVE_GROUP_USE_CASES_PROXY = 'leaveGroupUseCaseProxy';
  static FIND_GROUP_MEMBERS_USE_CASES_PROXY = 'findGroupMembersUseCaseProxy';
  static FIND_USER_GROUPS_USE_CASES_PROXY = 'findUserGroupsUseCaseProxy';
  static UPDATE_GROUP_MEMBERSHIP_USE_CASES_PROXY =
    'updateGroupMembershipUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyGroupMembershipModule,
      providers: [
        {
          inject: [
            TypeormGroupMembershipsRepository,
            UseCasesProxyGroupModule.UPDATE_GROUP_USE_CASES_PROXY,
          ],
          provide:
            UseCasesProxyGroupMembershipModule.JOIN_GROUP_USE_CASES_PROXY,
          useFactory: (
            groupMemberships: TypeormGroupMembershipsRepository,
            updateGroup: UseCaseProxy<UpdateGroupUseCase>,
          ) =>
            new UseCaseProxy(
              new JoinGroupUseCase(groupMemberships, updateGroup),
            ),
        },
        {
          inject: [TypeormGroupMembershipsRepository],
          provide:
            UseCasesProxyGroupMembershipModule.LEAVE_GROUP_USE_CASES_PROXY,
          useFactory: (groupMemberships: TypeormGroupMembershipsRepository) =>
            new UseCaseProxy(new LeaveGroupUseCase(groupMemberships)),
        },
        {
          inject: [TypeormGroupMembershipsRepository],
          provide:
            UseCasesProxyGroupMembershipModule.FIND_GROUP_MEMBERS_USE_CASES_PROXY,
          useFactory: (groupMemberships: TypeormGroupMembershipsRepository) =>
            new UseCaseProxy(new FindGroupMembersUseCase(groupMemberships)),
        },
        {
          inject: [TypeormGroupMembershipsRepository],
          provide:
            UseCasesProxyGroupMembershipModule.FIND_USER_GROUPS_USE_CASES_PROXY,
          useFactory: (groupMemberships: TypeormGroupMembershipsRepository) =>
            new UseCaseProxy(new FindUserGroupsUseCase(groupMemberships)),
        },
        {
          inject: [TypeormGroupMembershipsRepository],
          provide:
            UseCasesProxyGroupMembershipModule.UPDATE_GROUP_MEMBERSHIP_USE_CASES_PROXY,
          useFactory: (groupMemberships: TypeormGroupMembershipsRepository) =>
            new UseCaseProxy(
              new UpdateGroupMembershipUseCase(groupMemberships),
            ),
        },
      ],
      exports: [
        UseCasesProxyGroupMembershipModule.JOIN_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupMembershipModule.LEAVE_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupMembershipModule.FIND_GROUP_MEMBERS_USE_CASES_PROXY,
        UseCasesProxyGroupMembershipModule.FIND_USER_GROUPS_USE_CASES_PROXY,
        UseCasesProxyGroupMembershipModule.UPDATE_GROUP_MEMBERSHIP_USE_CASES_PROXY,
      ],
    };
  }
}
