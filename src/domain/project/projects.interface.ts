import { CreateProjectDTO } from '../../infrastructure/web/controllers/project/dto/create-project.dto';
import { UpdateProjectDTO } from '../../infrastructure/web/controllers/project/dto/update-project.dto';
import { Project } from './project';

export interface Projects {
  createProject(createProjectDTO: CreateProjectDTO): Promise<Project>;

  updateProjectById(
    id: string,
    updateProjectDTO: UpdateProjectDTO,
  ): Promise<void>;

  findBy(props: { id?: string; name?: string }): Promise<Project>;

  initialisedProjectById(id: string): Promise<void>;
}
