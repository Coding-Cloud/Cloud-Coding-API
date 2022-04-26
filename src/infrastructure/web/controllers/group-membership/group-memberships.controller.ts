import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
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
import { FindGroupMembersUseCase } from '../../../../usecases/group-membership/find-group-members.usecase';
import { FindUserGroupsUseCase } from '../../../../usecases/group-membership/find-user-groups.usecase';
import { GroupMembership } from '../../../../domain/group-membership/group-membership';
import { UpdateGroupMembershipUseCase } from '../../../../usecases/group-membership/update-group-membership.usecase';

@Controller('group-memberships')
@ApiTags('group-memberships')
@UseGuards(AuthGuard)
export class GroupMembershipsController {
  constructor(
    @Inject(UseCasesProxyGroupMembershipModule.JOIN_GROUP_USE_CASES_PROXY)
    private readonly addGroupMember: UseCaseProxy<JoinGroupUseCase>,
    @Inject(UseCasesProxyGroupMembershipModule.LEAVE_GROUP_USE_CASES_PROXY)
    private readonly leaveGroup: UseCaseProxy<LeaveGroupUseCase>,
    @Inject(
      UseCasesProxyGroupMembershipModule.FIND_GROUP_MEMBERS_USE_CASES_PROXY,
    )
    private readonly findGroupMembers: UseCaseProxy<FindGroupMembersUseCase>,
    @Inject(UseCasesProxyGroupMembershipModule.FIND_USER_GROUPS_USE_CASES_PROXY)
    private readonly findUserGroups: UseCaseProxy<FindUserGroupsUseCase>,
    @Inject(
      UseCasesProxyGroupMembershipModule.UPDATE_GROUP_MEMBERSHIP_USE_CASES_PROXY,
    )
    private readonly updateGroupMembership: UseCaseProxy<UpdateGroupMembershipUseCase>,
  ) {}

  @Post('/:groupId/:userId')
  addUser(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.addGroupMember.getInstance().addUser(userId, groupId);
  }

  @Get('/user/:userId')
  findGroups(@Param('userId') userId: string): Promise<GroupMembership[]> {
    return this.findUserGroups.getInstance().findUserGroups(userId);
  }

  @Get('/group/:groupId')
  findMembers(@Param('groupId') groupId: string): Promise<GroupMembership[]> {
    return this.findGroupMembers.getInstance().findGroupMembers(groupId);
  }

  @Patch('/:groupId/:userId')
  updateMembership(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Body('canEdit') canEdit: boolean,
  ): Promise<void> {
    return this.updateGroupMembership
      .getInstance()
      .updateGroupMembership(userId, groupId, canEdit);
  }

  @Delete('/:groupId')
  leave(
    @Param('groupId') groupId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.leaveGroup.getInstance().leaveGroup(user.id, groupId);
  }
}
