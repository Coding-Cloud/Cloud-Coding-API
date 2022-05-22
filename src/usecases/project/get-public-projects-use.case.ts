import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';

export class GetPublicProjectsUseCase {
  constructor(private readonly projects: Projects) {}

  async getProjects(
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<[Project[], number]> {
    return this.projects.getProjects(search, limit, offset);
  }
}
