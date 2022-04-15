import { GroupEntity } from './group.entity';
import { Group } from '../../../../domain/group/group';

export default class GroupAdapter {
  static toGroup(group: GroupEntity): Group {
    const { id, name, ownerId, createdWithProject, createdAt } = group;
    return {
      id,
      name,
      ownerId,
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
