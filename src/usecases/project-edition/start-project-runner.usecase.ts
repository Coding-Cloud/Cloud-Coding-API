import { Projects } from '../../domain/project/projects.interface';
import { CodeRunnerApi } from '../../infrastructure/code-runner/code-runner-api.abstract';
import { Logger } from '@nestjs/common';
import { ProjectStatus } from '../../domain/project/project-status.enum';

export class StartProjectRunnerUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly codeRunnerApi: CodeRunnerApi,
  ) {}

  async startProjectRunner(id: string): Promise<void> {
    const project = await this.projects.findBy({ id });
    if (project.status === ProjectStatus.INACTIVE) {
      const subscription = this.codeRunnerApi
        .startCodeRunner(id, project.language)
        .subscribe({
          next: () => Logger.log(`Started code runner for project {${id}}`),
          error: (error) => Logger.error(error),
          complete: () => subscription.unsubscribe(),
        });
      project.status = ProjectStatus.RUNNING;
      await this.projects.updateProjectById(id, project);
    }
  }
}
