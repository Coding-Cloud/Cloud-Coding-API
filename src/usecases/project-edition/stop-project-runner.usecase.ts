import { Projects } from '../../domain/project/projects.interface';
import { CodeRunnerApi } from '../../infrastructure/code-runner/code-runner-api.abstract';
import { Logger } from '@nestjs/common';
import { ProjectStatus } from '../../domain/project/project-status.enum';
import { Project } from '../../domain/project/project';

export class StopProjectRunnerUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly codeRunnerApi: CodeRunnerApi,
  ) {}

  async stopProjectRunner(id: string): Promise<void> {
    const project = await this.projects.findBy({ id });
    if (project.status === ProjectStatus.RUNNING) {
      const subscription = this.codeRunnerApi.stopCodeRunner(id).subscribe({
        next: () => Logger.log(`Stopped code runner for project {${id}}`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
      const project = new Project();
      project.status = ProjectStatus.INACTIVE;
      await this.projects.updateProjectById(id, project);
    }
  }
}
