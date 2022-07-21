import { Projects } from '../../domain/project/projects.interface';
import { ProjectVersioningApi } from '../../infrastructure/project-versioning/project-versioning.abstract';
import { firstValueFrom } from 'rxjs';

export class GetProjectVersionsUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly projectVersioningApi: ProjectVersioningApi,
  ) {}

  async getProjectVersions(uniqueName: string): Promise<string[]> {
    return (
      await firstValueFrom(
        this.projectVersioningApi.getProjectVersions(uniqueName),
      )
    ).data;
  }
}
