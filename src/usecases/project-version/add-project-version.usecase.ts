import { Projects } from '../../domain/project/projects.interface';
import { Logger } from '@nestjs/common';
import { ProjectVersioningApi } from '../../infrastructure/project-versioning/project-versioning.abstract';

export class AddProjectVersionUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly projectVersioningApi: ProjectVersioningApi,
  ) {}

  async addProjectVersion(id: string, title: string): Promise<void> {
    const project = await this.projects.findBy({ id });
    const lastVersion = (project.lastVersion += 1);
    const subscription = this.projectVersioningApi
      .addProjectVersion(id, lastVersion, title)
      .subscribe({
        next: () =>
          Logger.log(`Project {${id}} added new version {${lastVersion}}`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
    await this.projects.updateProjectById(id, { lastVersion });
  }
}
