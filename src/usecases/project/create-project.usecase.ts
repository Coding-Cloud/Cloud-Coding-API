import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';
import { CreateProjectDTO } from '../../infrastructure/controllers/project/dto/create-project.dto';

export class CreateProjectUseCase {
  constructor(private readonly projects: Projects) {}

  async createProject(createProjectDTO: CreateProjectDTO): Promise<Project> {
    return this.projects.createProject(createProjectDTO);
  }
}
