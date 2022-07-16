import { ProjectLanguage } from '../../domain/project/project-language.enum';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

export abstract class CodeRunnerApi {
  abstract startCodeRunner(uniqueName: string): Observable<AxiosResponse<void>>;

  abstract deleteCodeRunner(
    uniqueName: string,
  ): Observable<AxiosResponse<void>>;

  abstract createCodeRunner(
    uniqueName: string,
    language: ProjectLanguage,
  ): Observable<AxiosResponse<void>>;

  abstract restartCodeRunner(
    uniqueName: string,
  ): Observable<AxiosResponse<void>>;

  abstract dependenciesCodeRunner(
    uniqueName: string,
  ): Observable<AxiosResponse<void>>;
}
