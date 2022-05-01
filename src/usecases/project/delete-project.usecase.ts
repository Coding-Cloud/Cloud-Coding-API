import { Projects } from '../../domain/project/projects.interface';
import { ProjectInitializerApi } from '../../infrastructure/project-initializer/project-initializer.abstract';
import { Logger } from '@nestjs/common';

export class DeleteProjectUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly projectInitializerApi: ProjectInitializerApi,
  ) {}

  async deleteProject(id: string): Promise<void> {
    const project = await this.projects.findBy({ id });
    await this.projects.deleteProject(id);
    this.deleteRepository(project.uniqueName);
  }

  private deleteRepository(uniqueName: string): void {
    const subscription = this.projectInitializerApi
      .deleteProject(uniqueName)
      .subscribe({
        next: () =>
          Logger.log(`Project {${uniqueName}} repository has been deleted`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
  }
}
