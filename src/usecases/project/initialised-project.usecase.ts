import { Projects } from '../../domain/project/projects.interface';

export class InitialisedProjectUseCase {
  constructor(private readonly projects: Projects) {}

  async initialisedProjectStatusById(id: string): Promise<void> {
    return this.projects.initialisedProjectById(id);
  }
}
