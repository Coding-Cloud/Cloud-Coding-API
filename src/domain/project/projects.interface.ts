import { Project } from './project';
import { CreateProjectCandidate } from '../../infrastructure/repositories/candidates/project/create-project.candidate';
import { UpdateProjectCandidate } from '../../infrastructure/repositories/candidates/project/update-project.candidate';

export interface Projects {
  createProject(projectCandidate: CreateProjectCandidate): Promise<string>;

  updateProjectById(
    id: string,
    projectCandidate: UpdateProjectCandidate,
  ): Promise<void>;

  findBy(props: { id?: string; name?: string }): Promise<Project>;

  initialisedProjectById(id: string): Promise<void>;

  deleteProject(id: string): Promise<void>;
}
