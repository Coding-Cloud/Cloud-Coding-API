import { ProjectLanguage } from '../../domain/project/project-language.enum';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

export abstract class ProjectInitialiserApi {
  abstract initialiseProject(
    id: string,
    language: ProjectLanguage,
  ): Observable<AxiosResponse<void>>;

  abstract deleteProject(id: string): Observable<AxiosResponse<void>>;
}
