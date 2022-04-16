import { Projects } from '../../domain/project/projects.interface';
import { Logger } from '@nestjs/common';
import { Project } from '../../domain/project/project';

export class UpdateProjectUseCase {
  constructor(private readonly projects: Projects) {}

  async updateProjectStatusById(id: string, project: Project): Promise<void> {
    Logger.log(`Project {${id}} updated with values {${project}}`);
    return this.projects.updateProjectById(id, project);
  }
}
