import { ProjectEntity } from './project.entity';
import { Project } from '../../../../domain/project/project';

export default class ProjectAdapter {
  static toProject(project: ProjectEntity): Project {
    const {
      id,
      name,
      lastVersion,
      language,
      status,
      globalVisibility,
      creatorId,
      groupId,
      createdAt,
    } = project;
    return {
      id,
      name,
      lastVersion,
      language,
      status,
      globalVisibility,
      creatorId,
      groupId,
      createdAt,
    };
  }

  static toProjectEntity(project: Project): ProjectEntity {
    return {
      ...project,
    };
  }
}
