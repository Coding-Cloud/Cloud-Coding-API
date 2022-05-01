import { CodeRunnerApi } from './code-runner-api.abstract';
import { ProjectLanguage } from '../../domain/project/project-language.enum';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

export class HelmBridgeApi implements CodeRunnerApi {
  constructor(private httpService: HttpService) {}

  startCodeRunner(
    uniqueName: string,
    language: ProjectLanguage,
  ): Observable<AxiosResponse<void>> {
    return this.httpService.post(
      `${process.env.HELM_BRIDGE_URL}/runners/${uniqueName}/${language}`,
    );
  }

  stopCodeRunner(uniqueName: string): Observable<AxiosResponse<void>> {
    return this.httpService.delete(
      `${process.env.HELM_BRIDGE_URL}/runners/${uniqueName}`,
    );
  }
}
