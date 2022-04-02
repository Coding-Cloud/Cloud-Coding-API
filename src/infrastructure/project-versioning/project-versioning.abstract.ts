import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { AddProjectVersionDTO } from '../web/controllers/project-version/dto/add-project-version.dto';

export abstract class ProjectVersioningApi {
  abstract getProjectVersions(id: string): Observable<AxiosResponse<string[]>>;

  abstract addProjectVersion(
    id: string,
    addProjectVersionDTO: AddProjectVersionDTO,
  ): Observable<AxiosResponse<void>>;

  abstract rollbackProjectVersion(
    id: string,
    versions: number,
  ): Observable<AxiosResponse<void>>;
}
