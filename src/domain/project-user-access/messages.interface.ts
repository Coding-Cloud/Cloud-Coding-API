import { ProjectUserAccess } from './project-user-access';

export interface ProjectUserAccesses {
  createProjectUserAccess(message: ProjectUserAccess): Promise<string>;

  findByProjectId(projectId: string): Promise<ProjectUserAccess[]>;

  findByUserId(userId: string): Promise<ProjectUserAccess[]>;

  deleteProjectUserAccesses(id: string): Promise<void>;
}
