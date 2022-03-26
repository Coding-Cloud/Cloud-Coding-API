import { Projects } from '../../domain/project/projects.interface';
import { UpdateProjectDTO } from '../../infrastructure/controllers/project/dto/update-project.dto';

export class UpdateProjectUseCase {
  constructor(private readonly projects: Projects) {}

  async updateProjectStatusById(
    id: string,
    updateProjectDTO: UpdateProjectDTO,
  ): Promise<void> {
    return this.projects.updateProjectById(id, updateProjectDTO);
  }
}
