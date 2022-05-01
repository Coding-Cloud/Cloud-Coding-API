import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';
import { CodeWriter } from '../../domain/code-writer.abstract';
import { Logger, NotFoundException } from '@nestjs/common';

export class FindProjectUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly codeWriter: CodeWriter,
  ) {}

  async findProjectBy(data: {
    id?: string;
    uniqueName?: string;
  }): Promise<Project> {
    const project = await this.projects.findBy(data);
    if (
      process.env.VERIF_REPO_PROJECT &&
      !this.codeWriter.verifyFileExist(
        `${process.env.BASE_PATH_PROJECT}/${project.uniqueName}`,
      )
    ) {
      Logger.error(`Unable to find repository for ${project.uniqueName}`);
      throw new NotFoundException(
        `Unable to find repository for ${project.uniqueName}`,
      );
    }
    return project;
  }
}
