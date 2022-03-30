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
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { UseCasesProxyProjectModule } from '../../../usecases-proxy/project/use-cases-proxy-project.module';
import { CreateProjectUseCase } from '../../../../usecases/project/create-project.usecase';
import { UpdateProjectUseCase } from '../../../../usecases/project/update-project-use.case';
import { CreateProjectDTO } from './dto/create-project.dto';
import { Project } from '../../../../domain/project/project';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { InitialisedProjectUseCase } from '../../../../usecases/project/initialised-project.usecase';
import { DeleteProjectUseCase } from '../../../../usecases/project/delete-project.usecase';
import { AuthGuard } from '../auth/auth.guards';
import { AddProjectVersionUseCase } from '../../../../usecases/project/add-project-version.usecase';
import { GetProjectVersionsUseCase } from '../../../../usecases/project/get-project-versions.usecase';
import { RollbackProjectVersionUseCase } from '../../../../usecases/project/rollback-project-version.usecase';

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
    @Inject(UseCasesProxyProjectModule.ADD_PROJECT_VERSION_USE_CASES_PROXY)
    private readonly addVersion: UseCaseProxy<AddProjectVersionUseCase>,
    @Inject(UseCasesProxyProjectModule.GET_PROJECT_VERSIONS_USE_CASES_PROXY)
    private readonly getVersions: UseCaseProxy<GetProjectVersionsUseCase>,
    @Inject(UseCasesProxyProjectModule.ROLLBACK_PROJECT_VERSION_USE_CASES_PROXY)
    private readonly rollbackVersion: UseCaseProxy<RollbackProjectVersionUseCase>,
  ) {}

  @Post()
  create(@Body() createProjectDTO: CreateProjectDTO): Promise<Project> {
    return this.createProject.getInstance().createProject(createProjectDTO);
  }

  @Post('/:id/version')
  addProjectVersion(
    @Param('id') id: string,
    @Body('title') title: string,
  ): Promise<void> {
    return this.addVersion.getInstance().addProjectVersion(id, title);
  }

  @Get('/:id/version')
  getProjectVersions(@Param('id') id: string): Promise<string[]> {
    return this.getVersions.getInstance().getProjectVersions(id);
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
    return this.update
      .getInstance()
      .updateProjectStatusById(id, updateProjectDTO);
  }

  @Patch('/:id/version/:versions')
  rollbackProjectVersion(
    @Param('id') id: string,
    @Param('versions') versions: number,
  ): Promise<void> {
    return this.rollbackVersion
      .getInstance()
      .rollbackProjectVersion(id, versions);
  }
}
