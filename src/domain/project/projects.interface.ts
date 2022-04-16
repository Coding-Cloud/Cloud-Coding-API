import { Project } from './project';

export interface Projects {
  createProject(project: Project): Promise<Project>;

  updateProjectById(id: string, project: Project): Promise<void>;

  findBy(props: { id?: string; name?: string }): Promise<Project>;

  initialisedProjectById(id: string): Promise<void>;

  deleteProject(id: string): Promise<void>;
}
