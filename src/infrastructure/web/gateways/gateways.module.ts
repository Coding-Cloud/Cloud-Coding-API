import { Module } from '@nestjs/common';
import { CodeRunnerModule } from '../../code-runner/code-runner.module';
import { ProjectEditionGateway } from './project-edition/project-edition.gateway';

@Module({
  imports: [CodeRunnerModule],
  providers: [ProjectEditionGateway],
})
export class GatewaysModule {}
