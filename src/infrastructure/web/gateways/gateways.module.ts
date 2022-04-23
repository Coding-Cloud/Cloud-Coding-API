import { Module } from '@nestjs/common';
import { ProjectEditionGateway } from './project-edition/project-edition.gateway';
import { UseCasesProxyProjectEditionModule } from '../../usecases-proxy/project-edition/use-cases-proxy-project-edition.module';

@Module({
  imports: [UseCasesProxyProjectEditionModule.register()],
  providers: [ProjectEditionGateway],
})
export class GatewaysModule {}
