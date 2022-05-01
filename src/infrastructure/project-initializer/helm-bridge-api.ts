import { ProjectInitializerApi } from './project-initializer.abstract';
import { ProjectLanguage } from '../../domain/project/project-language.enum';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Inject } from '@nestjs/common';

export class HelmBridgeApi implements ProjectInitializerApi {
  constructor(@Inject() private httpService: HttpService) {}

  initialiseProject(
    uniqueName: string,
    language: ProjectLanguage,
  ): Observable<AxiosResponse<void>> {
    return this.httpService.post(
      `${process.env.HELM_BRIDGE_URL}/projects/${uniqueName}/${language}`,
    );
  }

  deleteProject(uniqueName: string): Observable<AxiosResponse<void>> {
    return this.httpService.delete(
      `${process.env.HELM_BRIDGE_URL}/projects/${uniqueName}`,
    );
  }
}
