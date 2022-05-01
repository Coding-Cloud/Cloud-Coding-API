import { Projects } from '../../domain/project/projects.interface';
import { Logger } from '@nestjs/common';
import { ProjectVersioningApi } from '../../infrastructure/project-versioning/project-versioning.abstract';
import { AddProjectVersion } from './types/add-project-version';

export class AddProjectVersionUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly projectVersioningApi: ProjectVersioningApi,
  ) {}

  async addProjectVersion(addProjectVersion: AddProjectVersion): Promise<void> {
    const project = await this.projects.findBy({ id: addProjectVersion.id });

    const lastVersion = project.lastVersion + 1;
    const subscription = this.projectVersioningApi
      .addProjectVersion({
        projectUniqueName: project.uniqueName,
        title: addProjectVersion.title,
        version: lastVersion,
      })
      .subscribe({
        next: () =>
          Logger.log(
            `Project {${project.uniqueName}} added new version {${project.lastVersion}}`,
          ),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
    await this.projects.updateProjectById(addProjectVersion.id, {
      lastVersion,
    });
  }
}
