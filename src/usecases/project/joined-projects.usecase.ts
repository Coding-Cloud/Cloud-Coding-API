import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';

export class JoinedProjectsUseCase {
  constructor(private readonly projects: Projects) {}

  async getJoinedProjects(userId: string): Promise<Project[]> {
    return this.projects.getJoinedProjects(userId);
  }
}
