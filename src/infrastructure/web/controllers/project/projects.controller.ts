import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { UseCasesProxyProjectModule } from '../../../usecases-proxy/project/use-cases-proxy-project.module';
import { CreateProjectUseCase } from '../../../../usecases/project/create-project.usecase';
import { UpdateProjectUseCase } from '../../../../usecases/project/update-project.usecase';
import { CreateProjectDTO } from './dto/create-project.dto';
import { Project } from '../../../../domain/project/project';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { InitialisedProjectUseCase } from '../../../../usecases/project/initialised-project.usecase';
import { DeleteProjectUseCase } from '../../../../usecases/project/delete-project.usecase';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { AuthGuard } from '../auth/auth.guards';
import { CreateProjectCandidate } from '../../../repositories/candidates/project/create-project.candidate';
import { ProjectStatus } from '../../../../domain/project/project-status.enum';

@Controller('projects')
@ApiTags('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(
    @Inject(UseCasesProxyProjectModule.CREATE_PROJECT_USE_CASES_PROXY)
    private readonly createProject: UseCaseProxy<CreateProjectUseCase>,
    @Inject(UseCasesProxyProjectModule.DELETE_PROJECT_USE_CASES_PROXY)
    private readonly deleteProject: UseCaseProxy<DeleteProjectUseCase>,
    @Inject(UseCasesProxyProjectModule.UPDATE_PROJECT_USE_CASES_PROXY)
    private readonly update: UseCaseProxy<UpdateProjectUseCase>,
    @Inject(UseCasesProxyProjectModule.INITIALISED_PROJECT_USE_CASES_PROXY)
    private readonly initialised: UseCaseProxy<InitialisedProjectUseCase>,
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

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.deleteProject.getInstance().deleteProject(id);
  }

  @Patch('/:id/initialised')
  initialisedProject(@Param('id') id: string): Promise<void> {
    return this.initialised.getInstance().initialisedProjectStatusById(id);
  }

  @Patch('/:id')
  updateProjectById(
    @Param('id') id: string,
    @Body() updateProjectDTO: UpdateProjectDTO,
  ): Promise<void> {
    const project: Project = new Project();
    project.name = updateProjectDTO.name;
    project.globalVisibility = updateProjectDTO.globalVisibility;

    return this.update.getInstance().updateProjectStatusById(id, project);
  }
}
