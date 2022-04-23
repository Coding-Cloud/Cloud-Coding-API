import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';

export class FindGroupProjectsUseCase {
  constructor(private readonly projects: Projects) {}

  async findGroupProjects(groupId: string): Promise<Project[]> {
    return this.projects.findByGroupId(groupId);
  }
}
