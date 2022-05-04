import { Projects } from '../../domain/project/projects.interface';
import { CodeRunnerApi } from '../../infrastructure/code-runner/code-runner-api.abstract';
import { ProjectStatus } from '../../domain/project/project-status.enum';
import { Logger } from '@nestjs/common';
import { ProjectLanguage } from '../../domain/project/project-language.enum';

export class StartProjectRunnerUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly codeRunnerApi: CodeRunnerApi,
  ) {}

  async   startProjectRunner(uniqueName: string): Promise<void> {
    const project = await this.projects.findBy({ uniqueName });
    if (project.status === ProjectStatus.INACTIVE) {
      this.startCodeRunner(project.uniqueName, project.language);
      await this.projects.updateProjectById(project.id, {
        status: ProjectStatus.RUNNING,
      });
    }
  }

  private startCodeRunner(uniqueName: string, language: ProjectLanguage): void {
    const subscription = this.codeRunnerApi
      .startCodeRunner(uniqueName, language)
      .subscribe({
        next: () =>
          Logger.log(`Started code runner for project {${uniqueName}}`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
  }
}
