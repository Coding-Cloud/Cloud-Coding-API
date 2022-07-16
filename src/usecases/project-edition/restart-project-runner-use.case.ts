import { Projects } from '../../domain/project/projects.interface';
import { CodeRunnerApi } from '../../infrastructure/code-runner/code-runner-api.abstract';
import { Logger } from '@nestjs/common';

export class RestartProjectRunnerUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly codeRunnerApi: CodeRunnerApi,
  ) {}

  async restartProjectRunner(uniqueName: string): Promise<void> {
    const subscription = this.codeRunnerApi
      .restartCodeRunner(uniqueName)
      .subscribe({
        next: () =>
          Logger.log(`Restarted code runner for project {${uniqueName}}`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
  }
}
