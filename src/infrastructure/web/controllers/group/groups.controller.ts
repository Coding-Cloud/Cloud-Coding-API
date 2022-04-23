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
import { CreateGroupDTO } from './dto/create-group.dto';
import { Group } from '../../../../domain/group/group';
import { UpdateGroupDTO } from './dto/update-group.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { GetGroupUseCase } from '../../../../usecases/group/get-group.usecase';
import { UseCasesProxyGroupModule } from '../../../usecases-proxy/group/use-cases-proxy-group.module';
import { UpdateGroupUseCase } from '../../../../usecases/group/update-group.usecase';
import { DeleteGroupUseCase } from '../../../../usecases/group/delete-group.usecase';
import { CreateGroupUseCase } from '../../../../usecases/group/create-group.usecase';
import { AuthGuard } from '../auth/auth.guards';
import { CreateGroupCandidate } from '../../../../usecases/group/candidates/create-group.candidate';
import { UpdateGroupCandidate } from '../../../../usecases/group/candidates/update-group.candidate';
import { FindOwnedGroupsUseCase } from '../../../../usecases/group/find-owned-groups.usecase';
import { FindUserGroupsUseCase } from '../../../../usecases/group/find-user-groups-use.case';

@Controller('groups')
@ApiTags('groups')
@UseGuards(AuthGuard)
export class GroupsController {
  constructor(
    @Inject(UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY)
    private readonly createGroup: UseCaseProxy<CreateGroupUseCase>,
    @Inject(UseCasesProxyGroupModule.GET_GROUP_USE_CASES_PROXY)
    private readonly getGroup: UseCaseProxy<GetGroupUseCase>,
    @Inject(UseCasesProxyGroupModule.FIND_OWNED_GROUPS_USE_CASES_PROXY)
    private readonly findOwnedGroups: UseCaseProxy<FindOwnedGroupsUseCase>,
    @Inject(UseCasesProxyGroupModule.FIND_MEMBER_GROUPS_USE_CASES_PROXY)
    private readonly findUserGroups: UseCaseProxy<FindUserGroupsUseCase>,
    @Inject(UseCasesProxyGroupModule.DELETE_GROUP_USE_CASES_PROXY)
    private readonly deleteGroup: UseCaseProxy<DeleteGroupUseCase>,
    @Inject(UseCasesProxyGroupModule.UPDATE_GROUP_USE_CASES_PROXY)
    private readonly updateGroup: UseCaseProxy<UpdateGroupUseCase>,
  ) {}

  @Post()
  create(
    @Body() createGroupDTO: CreateGroupDTO,
    @GetUser() user: User,
  ): Promise<Group> {
    const groupCandidate: CreateGroupCandidate = {
      ownerId: user.id,
      name: createGroupDTO.name,
      createdWithProject: false,
    };

    return this.createGroup.getInstance().createGroup(groupCandidate);
  }

  @Get('/owned')
  findGroupsOwned(@GetUser() user: User): Promise<Group[]> {
    return this.findOwnedGroups.getInstance().findOwnedGroups(user.id);
  }

  @Get('/member')
  getUserGroups(@GetUser() user: User): Promise<Group[]> {
    return this.findUserGroups.getInstance().findUserGroups(user.id);
  }

  @Get('/:id')
  findById(@Param('id') id: string): Promise<Group> {
    return this.getGroup.getInstance().getGroup(id);
  }

  @Patch('/:id')
  updateGroupById(
    @Param('id') id: string,
    @Body() updateGroupDTO: UpdateGroupDTO,
  ): Promise<void> {
    const group: UpdateGroupCandidate = {
      name: updateGroupDTO.name,
    };

    return this.updateGroup.getInstance().updateGroupById(id, group);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.deleteGroup.getInstance().deleteGroup(id);
  }
}
