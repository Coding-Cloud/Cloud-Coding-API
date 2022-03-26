import { ProjectLanguageEnum } from '../../domain/project/project-language.enum';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

export abstract class CodeRunnerApi {
  abstract startCodeRunner(
    id: string,
    language: ProjectLanguageEnum,
  ): Observable<AxiosResponse<void>>;

  abstract stopCodeRunner(id: string): Observable<AxiosResponse<void>>;
}
