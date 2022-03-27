import { Projects } from '../../domain/project/projects.interface';
import { ProjectInitialiserApi } from '../../infrastructure/project-initialiser/project-initialiser.abstract';
import { Logger } from '@nestjs/common';

export class DeleteProjectUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly projectInitialiserApi: ProjectInitialiserApi,
  ) {}

  async deleteProject(id: string): Promise<void> {
    await this.projects.deleteProject(id);
    const subscription = this.projectInitialiserApi
      .deleteProject(id)
      .subscribe({
        next: () => subscription.unsubscribe(),
        error: (error) => Logger.error(error),
      });
  }
}
