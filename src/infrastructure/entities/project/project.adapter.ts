import { ProjectEntity } from './project.entity';
import { Project } from '../../../domain/project/project';

export default class ProjectAdapter {
  static toProject(project: ProjectEntity): Project {
    const { id, name, language, status } = project;
    return {
      id,
      name,
      language,
      status,
    };
  }

  static toProjectEntity(project: Project): ProjectEntity {
    return {
      ...project,
    };
  }
}
