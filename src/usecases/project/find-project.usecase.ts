import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';

export class FindProjectUseCase {
  constructor(private readonly projects: Projects) {}

  async findProjectBy(data: {
    id?: string;
    uniqueName?: string;
  }): Promise<Project> {
    return await this.projects.findBy(data);
  }
}
