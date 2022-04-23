import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';

export class FindOwnedProjectsUseCase {
  constructor(private readonly projects: Projects) {}

  async findProjectByCreatorId(creatorId: string): Promise<Project[]> {
    return this.projects.findByCreatorId(creatorId);
  }
}
