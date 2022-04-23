import { Project } from './project';
import { CreateProjectCandidate } from '../../usecases/project/candidates/create-project.candidate';
import { UpdateProjectCandidate } from '../../usecases/project/candidates/update-project.candidate';

export interface Projects {
  createProject(projectCandidate: CreateProjectCandidate): Promise<string>;

  updateProjectById(
    id: string,
    projectCandidate: UpdateProjectCandidate,
  ): Promise<void>;

  findByCreatorId(creatorId: string): Promise<Project[]>;

  findByGroupId(groupId: string): Promise<Project[]>;

  findBy(props: {
    id?: string;
    userId?: string;
    name?: string;
  }): Promise<Project>;

  initialisedProjectById(id: string): Promise<void>;

  deleteProject(id: string): Promise<void>;
}
