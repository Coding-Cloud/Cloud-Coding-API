import { Projects } from '../../domain/project/projects.interface';
import { CodeRunnerApi } from '../../infrastructure/code-runner/code-runner-api.abstract';
import { Logger } from '@nestjs/common';

export class StartProjectRunnerUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly codeRunnerApi: CodeRunnerApi,
  ) {}

  async startProjectRunner(uniqueName: string): Promise<void> {
    const subscription = this.codeRunnerApi
      .startCodeRunner(uniqueName)
      .subscribe({
        next: () =>
          Logger.log(`Started code runner for project {${uniqueName}}`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
  }
}
