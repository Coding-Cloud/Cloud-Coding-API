import { Module } from '@nestjs/common';
import { ProjectEditionGateway } from './project-edition/project-edition.gateway';
import { UseCasesProxyProjectEditionModule } from '../../usecases-proxy/project-edition/use-cases-proxy-project-edition.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, UseCasesProxyProjectEditionModule.register()],
  providers: [ProjectEditionGateway],
})
export class GatewaysModule {}
