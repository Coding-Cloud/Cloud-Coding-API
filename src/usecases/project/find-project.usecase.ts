import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';
import { CodeWriter } from '../../domain/code-writer.abstract';
import { NotFoundException } from '@nestjs/common';

export class FindProjectUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly codeWriter: CodeWriter,
  ) {}

  async findProjectById(id: string): Promise<Project> {
    if (process.env.VERIF_REPO_PROJECT) {
      if (this.codeWriter.verifyFileExist(process.env.BASE_PATH_PROJECT + id)) {
        return this.projects.findBy({ id });
      }
      throw new NotFoundException();
    } else {
      return this.projects.findBy({ id });
    }
  }
}
