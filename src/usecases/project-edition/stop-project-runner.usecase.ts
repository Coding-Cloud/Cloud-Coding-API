import { Projects } from '../../domain/project/projects.interface';
import { CodeRunnerApi } from '../../infrastructure/code-runner/code-runner-api.abstract';
import { Logger } from '@nestjs/common';
import { ProjectStatus } from '../../domain/project/project-status.enum';

export class StopProjectRunnerUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly codeRunnerApi: CodeRunnerApi,
  ) {}

  async stopProjectRunner(uniqueName: string): Promise<void> {
    const project = await this.projects.findBy({ uniqueName });

    if (project.status === ProjectStatus.RUNNING) {
      this.stopCodeRunner(project.uniqueName);
      await this.projects.updateProjectById(project.id, {
        status: ProjectStatus.INACTIVE,
      });
    }
  }

  private stopCodeRunner(uniqueName: string) {
    const subscription = this.codeRunnerApi
      .deleteCodeRunner(uniqueName)
      .subscribe({
        next: () =>
          Logger.log(`Stopped code runner for project {${uniqueName}}`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
  }
}
