import { ProjectLanguage } from '../../domain/project/project-language.enum';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

export abstract class CodeRunnerApi {
  abstract startCodeRunner(
    uniqueName: string,
    language: ProjectLanguage,
  ): Observable<AxiosResponse<void>>;

  abstract stopCodeRunner(uniqueName: string): Observable<AxiosResponse<void>>;
}
