import { Projects } from '../../domain/project/projects.interface';
import { Project } from '../../domain/project/project';
import { CreateProjectDTO } from '../../infrastructure/web/controllers/project/dto/create-project.dto';
import { ProjectInitialiserApi } from '../../infrastructure/project-initialiser/project-initialiser.abstract';
import { Logger } from '@nestjs/common';

export class CreateProjectUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly projectInitialiserApi: ProjectInitialiserApi,
  ) {}

  async createProject(createProjectDTO: CreateProjectDTO): Promise<Project> {
    const project = await this.projects.createProject(createProjectDTO);
    const subscription = this.projectInitialiserApi
      .initialiseProject(project.id, project.language)
      .subscribe({
        next: () => subscription.unsubscribe(),
        error: (error) => Logger.error(error),
      });
    return project;
  }
}
