import { Projects } from '../../domain/project/projects.interface';
import { Logger } from '@nestjs/common';
import { ProjectVersioningApi } from '../../infrastructure/project-versioning/project-versioning.abstract';

export class RollbackProjectVersionUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly projectVersioningApi: ProjectVersioningApi,
  ) {}

  async rollbackProjectVersion(id: string, versions: number): Promise<void> {
    const project = await this.projects.findBy({ id });
    const lastVersion = (project.lastVersion -= versions);
    const subscription = this.projectVersioningApi
      .rollbackProjectVersion(id, versions)
      .subscribe({
        next: () => subscription.unsubscribe(),
        error: (error) => Logger.error(error),
      });
    await this.projects.updateProjectById(id, { lastVersion });
  }
}
