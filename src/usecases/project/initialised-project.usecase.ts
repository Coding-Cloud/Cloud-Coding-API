import { Projects } from '../../domain/project/projects.interface';
import { Logger } from '@nestjs/common';

export class InitialisedProjectUseCase {
  constructor(private readonly projects: Projects) {}

  async initialisedProjectStatus(uniqueName: string): Promise<void> {
    Logger.log(`Project {${uniqueName}} has been initialised`);
    return this.projects.initialisedProject(uniqueName);
  }
}
