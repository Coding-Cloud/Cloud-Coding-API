import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';

export class SearchUserProjectsUseCase {
  constructor(private readonly projects: Projects) {}

  async searchUserProjectsByName(
    userId: string,
    projectName: string,
  ): Promise<Project[]> {
    return this.projects.searchUserProjectsByName(userId, projectName);
  }
}
