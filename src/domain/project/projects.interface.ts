import { Project } from './project';
import { CreateProjectCandidate } from '../../usecases/project/candidates/create-project.candidate';
import { UpdateProjectCandidate } from '../../usecases/project/candidates/update-project.candidate';

export interface Projects {
  createProject(projectCandidate: CreateProjectCandidate): Promise<Project>;

  updateProjectById(
    id: string,
    projectCandidate: UpdateProjectCandidate,
  ): Promise<void>;

  findByCreatorId(creatorId: string): Promise<Project[]>;

  findByGroupId(groupId: string): Promise<Project[]>;

  findVisibleProjects(memberId: string): Promise<Project[]>;

  findBy(props: {
    id?: string;
    userId?: string;
    name?: string;
    uniqueName?: string;
  }): Promise<Project>;

  initialisedProject(uniqueName: string): Promise<void>;

  deleteProject(id: string): Promise<void>;

  searchUserProjectsByName(
    userId: string,
    projectName: string,
  ): Promise<Project[]>;

  getProjects(
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<[Project[], number]>;
}
