import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { UseCasesProxyGroupMembershipModule } from '../../../usecases-proxy/group-membership/use-cases-proxy-group-membership.module';
import { JoinGroupUseCase } from '../../../../usecases/group-membership/join-group.usecase';
import { LeaveGroupUseCase } from '../../../../usecases/group-membership/leave-project.usecase';
import { FindGroupMembersUseCase } from '../../../../usecases/group-membership/find-group-members-use.case';
import { FindUserGroupsUseCase } from '../../../../usecases/group-membership/find-user-groups.usecase';
import { GroupMembership } from '../../../../domain/group-membership/group-membership';

@Controller('group-memberships')
@ApiTags('group-memberships')
@UseGuards(AuthGuard)
export class GroupMembershipsController {
  constructor(
    @Inject(UseCasesProxyGroupMembershipModule.JOIN_GROUP_USE_CASES_PROXY)
    private readonly joinGroup: UseCaseProxy<JoinGroupUseCase>,
    @Inject(UseCasesProxyGroupMembershipModule.LEAVE_GROUP_USE_CASES_PROXY)
    private readonly leaveGroup: UseCaseProxy<LeaveGroupUseCase>,
    @Inject(
      UseCasesProxyGroupMembershipModule.FIND_GROUP_MEMBERS_USE_CASES_PROXY,
    )
    private readonly findGroupMembers: UseCaseProxy<FindGroupMembersUseCase>,
    @Inject(UseCasesProxyGroupMembershipModule.FIND_USER_GROUPS_USE_CASES_PROXY)
    private readonly findUserGroups: UseCaseProxy<FindUserGroupsUseCase>,
  ) {}

  @Post('/:groupId')
  join(
    @Param('groupId') groupId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.joinGroup.getInstance().joinGroup(user.id, groupId);
  }

  @Get('/user/:userId')
  findGroups(@Param('userId') userId: string): Promise<GroupMembership[]> {
    return this.findUserGroups.getInstance().findUserGroups(userId);
  }

  @Get('/group/:groupId')
  findMembers(@Param('groupId') groupId: string): Promise<GroupMembership[]> {
    return this.findGroupMembers.getInstance().findGroupMembers(groupId);
  }

  @Delete('/:groupId')
  leave(
    @Param('groupId') groupId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.leaveGroup.getInstance().leaveGroup(user.id, groupId);
  }
}
