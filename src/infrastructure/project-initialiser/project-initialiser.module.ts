import { Module } from '@nestjs/common';
import { ProjectInitialiserApi } from './project-initialiser.abstract';
import { HelmBridgeApi } from './helm-bridge-api';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    {
      inject: [HttpService],
      provide: ProjectInitialiserApi,
      useFactory: (httpService: HttpService) => new HelmBridgeApi(httpService),
    },
  ],
  exports: [ProjectInitialiserApi],
})
export class ProjectInitialiserModule {}
