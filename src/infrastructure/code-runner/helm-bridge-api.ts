import { CodeRunnerApi } from './code-runner-api.abstract';
import { ProjectLanguageEnum } from '../../domain/project/project-language.enum';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

export class HelmBridgeApi implements CodeRunnerApi {
  constructor(private httpService: HttpService) {}

  startCodeRunner(
    id: string,
    language: ProjectLanguageEnum,
  ): Observable<AxiosResponse<void>> {
    return this.httpService.post(
      `${process.env.HELM_BRIDGE_URL}/runners/${id}/${language}`,
    );
  }

  stopCodeRunner(id: string): Observable<AxiosResponse<void>> {
    return this.httpService.delete(
      `${process.env.HELM_BRIDGE_URL}/runners/${id}`,
    );
  }
}
