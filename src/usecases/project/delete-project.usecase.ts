import { Projects } from '../../domain/project/projects.interface';
import { ProjectInitializerApi } from '../../infrastructure/project-initializer/project-initializer.abstract';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class DeleteProjectUseCase {
  constructor(
    private readonly projects: Projects,
    private readonly projectInitializerApi: ProjectInitializerApi,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async deleteProject(id: string): Promise<void> {
    const project = await this.projects.findBy({ id });
    this.eventEmitter.emit('project.deleted', id);
    await this.projects.deleteProject(id);
    this.deleteRepository(project.uniqueName);
  }

  private deleteRepository(uniqueName: string): void {
    const subscription = this.projectInitializerApi
      .deleteProject(uniqueName)
      .subscribe({
        next: () =>
          Logger.log(`Project {${uniqueName}} repository has been deleted`),
        error: (error) => Logger.error(error),
        complete: () => subscription.unsubscribe(),
      });
  }
}
