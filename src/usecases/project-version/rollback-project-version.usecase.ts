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
      .rollbackProjectVersion(project.uniqueName, versions)
      .subscribe({
        next: () =>
          Logger.log(`Project {${id}} rolled back to version {${lastVersion}}`),
        complete: () => subscription.unsubscribe(),
        error: (error) => Logger.error(error),
      });
    project.lastVersion = lastVersion;
    await this.projects.updateProjectById(id, project);
  }
}
