import { CodeRunnerApi } from './code-runner-api.abstract';
import { HelmBridgeApi } from './helm-bridge-api';
import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    {
      inject: [HttpService],
      provide: CodeRunnerApi,
      useFactory: (httpService: HttpService) => new HelmBridgeApi(httpService),
    },
  ],
  exports: [CodeRunnerApi],
})
export class CodeRunnerModule {}
