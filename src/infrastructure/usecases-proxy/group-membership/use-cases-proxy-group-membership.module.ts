import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { TypeormGroupMembershipsRepository } from '../../repositories/repositories/typeorm-group-memberships.repository';
import { JoinGroupUseCase } from '../../../usecases/group-membership/join-group.usecase';
import { LeaveGroupUseCase } from '../../../usecases/group-membership/leave-project.usecase';
import { FindUserGroupsUseCase } from '../../../usecases/group-membership/find-user-groups.usecase';
import { FindGroupMembersUseCase } from '../../../usecases/group-membership/find-group-members-use.case';

@Module({
  imports: [RepositoriesModule],
})
export class UseCasesProxyGroupMembershipModule {
  static JOIN_GROUP_USE_CASES_PROXY = 'joinGroupUseCaseProxy';
  static LEAVE_GROUP_USE_CASES_PROXY = 'leaveGroupUseCaseProxy';
  static FIND_GROUP_MEMBERS_USE_CASES_PROXY = 'findGroupMembersUseCaseProxy';
  static FIND_USER_GROUPS_USE_CASES_PROXY = 'findUserGroupsUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyGroupMembershipModule,
      providers: [
        {
          inject: [TypeormGroupMembershipsRepository],
          provide:
            UseCasesProxyGroupMembershipModule.JOIN_GROUP_USE_CASES_PROXY,
          useFactory: (groupMemberships: TypeormGroupMembershipsRepository) =>
            new UseCaseProxy(new JoinGroupUseCase(groupMemberships)),
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
      ],
      exports: [
        UseCasesProxyGroupMembershipModule.JOIN_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupMembershipModule.LEAVE_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupMembershipModule.FIND_GROUP_MEMBERS_USE_CASES_PROXY,
        UseCasesProxyGroupMembershipModule.FIND_USER_GROUPS_USE_CASES_PROXY,
      ],
    };
  }
}
