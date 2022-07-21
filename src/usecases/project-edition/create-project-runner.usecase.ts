import { Projects } from '../../domain/project/projects.interface';
import { CodeRunnerApi } from '../../infrastructure/code-runner/code-runner-api.abstract';
import { ProjectStatus } from '../../domain/project/project-status.enum';
import { Logger } from '@nestjs/common';
import { ProjectLanguage } from '../../domain/project/project-language.enum';

export class CreateProjectRunnerUsecase {
  constructor(
    private readonly projects: Projects,
    private readonly codeRunnerApi: CodeRunnerApi,
  ) {}

  async createProjectRunner(uniqueName: string): Promise<void> {
    const project = await this.projects.findBy({ uniqueName });
    if (project.status === ProjectStatus.INACTIVE) {
      this.createCodeRunner(project.uniqueName, project.language);
      await this.projects.updateProjectById(project.id, {
        status: ProjectStatus.RUNNING,
      });
    }
  }

  private createCodeRunner(
    uniqueName: string,
    language: ProjectLanguage,
  ): void {
    const subscription = this.codeRunnerApi
      .createCodeRunner(uniqueName, language)
      .subscribe({
        next: () =>
          Logger.log(`Started code runner for project {${uniqueName}}`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
  }
}
