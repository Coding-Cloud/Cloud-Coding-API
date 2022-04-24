import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { UseCasesProxyProjectModule } from '../../../usecases-proxy/project/use-cases-proxy-project.module';
import { CreateProjectUseCase } from '../../../../usecases/project/create-project.usecase';
import { UpdateProjectUseCase } from '../../../../usecases/project/update-project.usecase';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { InitialisedProjectUseCase } from '../../../../usecases/project/initialised-project.usecase';
import { DeleteProjectUseCase } from '../../../../usecases/project/delete-project.usecase';
import { Folder } from 'src/domain/folder/folder.interface';
import { ReadProjectUseCase } from 'src/usecases/project/read-project-file.usecase';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { AuthGuard } from '../auth/auth.guards';
import { CreateProjectCandidate } from '../../../../usecases/project/candidates/create-project.candidate';
import { ProjectStatus } from '../../../../domain/project/project-status.enum';
import { UpdateProjectCandidate } from '../../../../usecases/project/candidates/update-project.candidate';
import { FindProjectUseCase } from '../../../../usecases/project/find-project.usecase';
import { Project } from '../../../../domain/project/project';
import { FindOwnedProjectsUseCase } from '../../../../usecases/project/find-owned-projects.usecase';
import { ProjectNameDto } from './dto/project-name.dto';
import { FindGroupProjectsUseCase } from '../../../../usecases/project/find-group-projects.usecase';
import { ChangeProjectGroupUseCase } from '../../../../usecases/project/change-project-group.usecase';

@Controller('projects')
@ApiTags('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(
    @Inject(UseCasesProxyProjectModule.CREATE_PROJECT_USE_CASES_PROXY)
    private readonly createProject: UseCaseProxy<CreateProjectUseCase>,
    @Inject(UseCasesProxyProjectModule.FIND_PROJECT_USE_CASES_PROXY)
    private readonly findProject: UseCaseProxy<FindProjectUseCase>,
    @Inject(UseCasesProxyProjectModule.FIND_OWNED_PROJECTS_USE_CASES_PROXY)
    private readonly findOwnedProjects: UseCaseProxy<FindOwnedProjectsUseCase>,
    @Inject(UseCasesProxyProjectModule.FIND_GROUP_PROJECTS_USE_CASES_PROXY)
    private readonly findGroupProjects: UseCaseProxy<FindGroupProjectsUseCase>,
    @Inject(UseCasesProxyProjectModule.DELETE_PROJECT_USE_CASES_PROXY)
    private readonly deleteProject: UseCaseProxy<DeleteProjectUseCase>,
    @Inject(UseCasesProxyProjectModule.CHANGE_PROJECT_GROUP_USE_CASES_PROXY)
    private readonly changeProjectGroup: UseCaseProxy<ChangeProjectGroupUseCase>,
    @Inject(UseCasesProxyProjectModule.UPDATE_PROJECT_USE_CASES_PROXY)
    private readonly update: UseCaseProxy<UpdateProjectUseCase>,
    @Inject(UseCasesProxyProjectModule.INITIALISED_PROJECT_USE_CASES_PROXY)
    private readonly initialised: UseCaseProxy<InitialisedProjectUseCase>,
    @Inject(UseCasesProxyProjectModule.READ_PROJECT_USE_CASES_PROXY)
    private readonly read: UseCaseProxy<ReadProjectUseCase>,
  ) {}

  @Post()
  create(
    @Body() createProjectDTO: CreateProjectDTO,
    @GetUser() user: User,
  ): Promise<string> {
    const projectCandidate: CreateProjectCandidate = {
      creatorId: user.id,
      groupId: createProjectDTO.groupId,
      globalVisibility: createProjectDTO.globalVisibility,
      name: createProjectDTO.name,
      language: createProjectDTO.language,
      status: ProjectStatus.INITIALISING,
    };

    return this.createProject.getInstance().createProject(projectCandidate);
  }

  @Get('/owned')
  findProjectByCreatorId(@GetUser() user: User): Promise<Project[]> {
    return this.findOwnedProjects.getInstance().findProjectByCreatorId(user.id);
  }

  @Get('/group/:groupId')
  findProjectByGroupId(@Param('groupId') groupId: string): Promise<Project[]> {
    return this.findGroupProjects.getInstance().findGroupProjects(groupId);
  }

  @Get('/:id')
  findProjectById(@Param('id') id: string): Promise<Project> {
    return this.findProject.getInstance().findProjectById(id);
  }

  @Get('/:id/name')
  async findProjectNameById(@Param('id') id: string): Promise<ProjectNameDto> {
    return {
      name: (await this.findProject.getInstance().findProjectById(id)).name,
    };
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.deleteProject.getInstance().deleteProject(id);
  }

  @Patch('/:id/initialised')
  initialisedProject(@Param('id') id: string): Promise<void> {
    return this.initialised.getInstance().initialisedProjectStatusById(id);
  }

  @Patch('/:id/:groupId')
  @ApiOperation({ summary: "Change project's group" })
  patchProjectGroup(
    @Param('id') id: string,
    @Param('groupId') groupId: string,
  ): Promise<void> {
    return this.changeProjectGroup
      .getInstance()
      .changeProjectGroup(id, groupId);
  }

  @Patch('/:id')
  updateProjectById(
    @Param('id') id: string,
    @Body() updateProjectDTO: UpdateProjectDTO,
  ): Promise<void> {
    const projectCandidate: UpdateProjectCandidate = {
      name: updateProjectDTO.name,
      globalVisibility: updateProjectDTO.globalVisibility,
    };

    return this.update
      .getInstance()
      .updateProjectStatusById(id, projectCandidate);
  }

  @Get('/')
  async getProject(@Query('path') path: string): Promise<{
    appFiles: { [key: string]: Folder };
  }> {
    return await this.read.getInstance().readProject({ path });
  }
}
