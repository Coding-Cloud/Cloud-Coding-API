import { Projects } from '../../domain/project/projects.interface';
import { CodeRunnerApi } from '../../infrastructure/code-runner/code-runner-api.abstract';
import { Logger } from '@nestjs/common';

export class DependenciesProjectRunnerUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly codeRunnerApi: CodeRunnerApi,
  ) {}

  async dependenciesProjectRunner(uniqueName: string): Promise<void> {
    const subscription = this.codeRunnerApi
      .dependenciesCodeRunner(uniqueName)
      .subscribe({
        next: () =>
          Logger.log(`Updating dependencies for project {${uniqueName}}`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
  }
}
