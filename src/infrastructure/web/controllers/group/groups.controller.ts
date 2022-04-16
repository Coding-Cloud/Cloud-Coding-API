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

@Controller('groups')
@ApiTags('groups')
@UseGuards(AuthGuard)
export class GroupsController {
  constructor(
    @Inject(UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY)
    private readonly createGroup: UseCaseProxy<CreateGroupUseCase>,
    @Inject(UseCasesProxyGroupModule.GET_GROUP_USE_CASES_PROXY)
    private readonly getGroup: UseCaseProxy<GetGroupUseCase>,
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
    const group: Group = new Group();
    group.ownerId = user.id;
    group.name = createGroupDTO.name;

    return this.createGroup.getInstance().createGroup(group);
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
    const group: Group = new Group();
    group.id = id;
    group.name = updateGroupDTO.name;

    return this.updateGroup.getInstance().updateGroupById(id, group);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.deleteGroup.getInstance().deleteGroup(id);
  }
}
