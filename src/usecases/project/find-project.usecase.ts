import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';

export class FindProjectUseCase {
  constructor(private readonly projects: Projects) {}

  async findProjectById(id: string): Promise<Project> {
    return this.projects.findBy({ id });
  }
}
