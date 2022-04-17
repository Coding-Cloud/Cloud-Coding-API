import { GroupEntity } from './group.entity';
import { Group } from '../../../../domain/group/group';

export default class GroupAdapter {
  static toGroup(group: GroupEntity): Group {
    const { id, name, ownerId, conversationId, createdWithProject, createdAt } =
      group;
    return {
      id,
      name,
      ownerId,
      conversationId,
      createdWithProject,
      createdAt,
    };
  }

  static toGroupEntity(group: Group): GroupEntity {
    return {
      ...group,
    };
  }
}
