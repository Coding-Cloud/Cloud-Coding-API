import { ProjectInitialiserApi } from './project-initialiser.abstract';
import { ProjectLanguage } from '../../domain/project/project-language.enum';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Inject } from '@nestjs/common';

export class HelmBridgeApi implements ProjectInitialiserApi {
  constructor(@Inject() private httpService: HttpService) {}

  initialiseProject(
    id: string,
    language: ProjectLanguage,
  ): Observable<AxiosResponse<void>> {
    return this.httpService.post(
      `${process.env.HELM_BRIDGE_URL}/projects/${id}/${language}`,
    );
  }

  deleteProject(id: string): Observable<AxiosResponse<void>> {
    return this.httpService.delete(
      `${process.env.HELM_BRIDGE_URL}/projects/${id}`,
    );
  }
}
