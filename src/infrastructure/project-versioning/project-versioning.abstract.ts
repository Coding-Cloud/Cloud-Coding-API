import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

export abstract class ProjectVersioningApi {
  abstract getProjectVersions(id: string): Observable<AxiosResponse<string[]>>;

  abstract addProjectVersion(
    id: string,
    version: number,
    title: string,
  ): Observable<AxiosResponse<void>>;

  abstract rollbackProjectVersion(
    id: string,
    versions: number,
  ): Observable<AxiosResponse<void>>;
}
