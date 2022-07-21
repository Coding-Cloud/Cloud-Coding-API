import { Module } from '@nestjs/common';
import { ProjectInitializerApi } from './project-initializer.abstract';
import { HelmBridgeApi } from './helm-bridge-api';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    {
      inject: [HttpService],
      provide: ProjectInitializerApi,
      useFactory: (httpService: HttpService) => new HelmBridgeApi(httpService),
    },
  ],
  exports: [ProjectInitializerApi],
})
export class ProjectInitializerModule {}
