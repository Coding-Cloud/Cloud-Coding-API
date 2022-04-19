import { Projects } from '../../domain/project/projects.interface';
import { Logger } from '@nestjs/common';
import { ProjectVersioningApi } from '../../infrastructure/project-versioning/project-versioning.abstract';
import { AddVersionCandidate } from './candidates/add-version.candidate';

export class AddProjectVersionUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly projectVersioningApi: ProjectVersioningApi,
  ) {}

  async addProjectVersion(id: string, title: string): Promise<void> {
    const project = await this.projects.findBy({ id });
    project.lastVersion = project.lastVersion += 1;
    const addVersionCandidate: AddVersionCandidate = {
      version: project.lastVersion,
      title,
    };

    const subscription = this.projectVersioningApi
      .addProjectVersion(id, addVersionCandidate)
      .subscribe({
        next: () =>
          Logger.log(
            `Project {${id}} added new version {${project.lastVersion}}`,
          ),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
    await this.projects.updateProjectById(id, project);
  }
}
