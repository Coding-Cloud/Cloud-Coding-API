import { Module } from '@nestjs/common';
import { HelmBridgeApi } from './helm-bridge-api';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ProjectVersioningApi } from './project-versioning.abstract';

@Module({
  imports: [HttpModule],
  providers: [
    {
      inject: [HttpService],
      provide: ProjectVersioningApi,
      useFactory: (httpService: HttpService) => new HelmBridgeApi(httpService),
    },
  ],
  exports: [ProjectVersioningApi],
})
export class ProjectVersioningModule {}
