import { Projects } from '../../domain/project/projects.interface';
import { Logger } from '@nestjs/common';

export class InitialisedProjectUseCase {
  constructor(private readonly projects: Projects) {}

  async initialisedProjectStatusById(id: string): Promise<void> {
    Logger.log(`Project {${id}} has been initialised`);
    return this.projects.initialisedProjectById(id);
  }
}
