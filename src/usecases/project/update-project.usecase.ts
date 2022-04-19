import { Projects } from '../../domain/project/projects.interface';
import { Logger } from '@nestjs/common';
import { UpdateProjectCandidate } from './candidates/update-project.candidate';

export class UpdateProjectUseCase {
  constructor(private readonly projects: Projects) {}

  async updateProjectStatusById(
    id: string,
    projectCandidate: UpdateProjectCandidate,
  ): Promise<void> {
    Logger.log(`Project {${id}} updated with values {${projectCandidate}}`);
    return this.projects.updateProjectById(id, projectCandidate);
  }
}
