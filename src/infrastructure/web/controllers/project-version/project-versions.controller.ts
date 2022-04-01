import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AddProjectVersionUseCase } from '../../../../usecases/project-version/add-project-version.usecase';
import { GetProjectVersionsUseCase } from '../../../../usecases/project-version/get-project-versions.usecase';
import { RollbackProjectVersionUseCase } from '../../../../usecases/project-version/rollback-project-version.usecase';
import { UseCasesProxyProjectVersioningModule } from '../../../usecases-proxy/project-version/use-cases-proxy-project-version.module';

@Controller('projects-version')
@ApiTags('projects-version')
//@UseGuards(AuthGuard)
export class ProjectVersionsController {
  constructor(
    @Inject(
      UseCasesProxyProjectVersioningModule.ADD_PROJECT_VERSION_USE_CASES_PROXY,
    )
    private readonly addVersion: UseCaseProxy<AddProjectVersionUseCase>,
    @Inject(
      UseCasesProxyProjectVersioningModule.GET_PROJECT_VERSIONS_USE_CASES_PROXY,
    )
    private readonly getVersions: UseCaseProxy<GetProjectVersionsUseCase>,
    @Inject(
      UseCasesProxyProjectVersioningModule.ROLLBACK_PROJECT_VERSION_USE_CASES_PROXY,
    )
    private readonly rollbackVersion: UseCaseProxy<RollbackProjectVersionUseCase>,
  ) {}

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