import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';

export class FindMemberVisibleProjectUseCase {
  constructor(private readonly projects: Projects) {}

  async findVisibleProjects(memberId: string): Promise<Project[]> {
    return this.projects.findVisibleProjects(memberId);
  }
}
