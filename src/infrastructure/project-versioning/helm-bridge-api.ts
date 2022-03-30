import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Inject } from '@nestjs/common';
import { ProjectVersioningApi } from './project-versioning.abstract';

export class HelmBridgeApi implements ProjectVersioningApi {
  constructor(@Inject() private httpService: HttpService) {}

  addProjectVersion(
    id: string,
    version: number,
    title: string,
  ): Observable<AxiosResponse<void>> {
    return this.httpService.post(
      `${process.env.HELM_BRIDGE_URL}/versions/${id}`,
      { version, title },
    );
  }

  getProjectVersions(id: string): Observable<AxiosResponse<string[]>> {
    return this.httpService.get(
      `${process.env.HELM_BRIDGE_URL}/versions/${id}`,
    );
  }

  rollbackProjectVersion(
    id: string,
    versions: number,
  ): Observable<AxiosResponse<void>> {
    return this.httpService.patch(
      `${process.env.HELM_BRIDGE_URL}/versions/${id}/${versions}`,
    );
  }
}
