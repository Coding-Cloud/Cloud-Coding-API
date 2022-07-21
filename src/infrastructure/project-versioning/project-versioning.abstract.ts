import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { AddProjectVersionDTO } from './types/add-project-version-dto';

export abstract class ProjectVersioningApi {
  abstract getProjectVersions(id: string): Observable<AxiosResponse<string[]>>;

  abstract addProjectVersion(
    addProjectVersionDTO: AddProjectVersionDTO,
  ): Observable<AxiosResponse<void>>;

  abstract rollbackProjectVersion(
    id: string,
    versions: number,
  ): Observable<AxiosResponse<void>>;
}
