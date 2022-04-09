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
import { Folder } from 'src/domain/folder/folder.interface';
import { ReadProjectUseCase } from 'src/usecases/project/read-project-file.usecase';

@Controller('projects')
@ApiTags('projects')
//@UseGuards(AuthGuard)
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
    @Inject(UseCasesProxyProjectModule.READ_PROJECT_USE_CASES_PROXY)
    private readonly read: UseCaseProxy<ReadProjectUseCase>,
  ) {}

  @Post()
  create(@Body() createProjectDTO: CreateProjectDTO): Promise<Project> {
    return this.createProject.getInstance().createProject(createProjectDTO);
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

  @Get('/')
  async getProject(@Query('path') path: string): Promise<{
    appFiles: { [key: string]: Folder };
  }> {
    return await this.read.getInstance().readProject({ path });
  }
}
