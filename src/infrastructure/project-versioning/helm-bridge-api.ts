import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Inject } from '@nestjs/common';
import { ProjectVersioningApi } from './project-versioning.abstract';
import { AddProjectVersionDTO } from './types/add-project-version-dto';

export class HelmBridgeApi implements ProjectVersioningApi {
  constructor(@Inject() private httpService: HttpService) {}

  addProjectVersion(
    addProjectVersionDTO: AddProjectVersionDTO,
  ): Observable<AxiosResponse<void>> {
    return this.httpService.post(
      `${process.env.HELM_BRIDGE_URL}/versions/${addProjectVersionDTO.projectUniqueName}`,
      {
        title: addProjectVersionDTO.title,
        version: addProjectVersionDTO.version,
      },
    );
  }

  getProjectVersions(
    projectUniqueName: string,
  ): Observable<AxiosResponse<string[]>> {
    return this.httpService.get(
      `${process.env.HELM_BRIDGE_URL}/versions/${projectUniqueName}`,
    );
  }

  rollbackProjectVersion(
    projectUniqueName: string,
    versions: number,
  ): Observable<AxiosResponse<void>> {
    return this.httpService.patch(
      `${process.env.HELM_BRIDGE_URL}/versions/${projectUniqueName}/${versions}`,
    );
  }
}
