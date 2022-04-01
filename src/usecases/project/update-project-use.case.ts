import { Projects } from '../../domain/project/projects.interface';
import { UpdateProjectDTO } from '../../infrastructure/web/controllers/project/dto/update-project.dto';
import { Logger } from '@nestjs/common';

export class UpdateProjectUseCase {
  constructor(private readonly projects: Projects) {}

  async updateProjectStatusById(
    id: string,
    updateProjectDTO: UpdateProjectDTO,
  ): Promise<void> {
    Logger.log(`Project {${id}} updated with values {${updateProjectDTO}}`);
    return this.projects.updateProjectById(id, updateProjectDTO);
  }
}
