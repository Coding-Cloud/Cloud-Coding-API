import { ProjectUserAccess } from '../../../../domain/project-user-access/project-user-access';
import { ProjectUserAccessEntity } from './project-user-access.entity';

export default class ProjectUserAccessAdapter {
  static toMessage(
    projectUserAccess: ProjectUserAccessEntity,
  ): ProjectUserAccess {
    const { id, userId, projectId, accessType } = projectUserAccess;
    return {
      id,
      userId,
      projectId,
      accessType,
    };
  }

  static toGroupEntity(
    projectUserAccess: ProjectUserAccess,
  ): ProjectUserAccessEntity {
    return {
      ...projectUserAccess,
    };
  }
}
