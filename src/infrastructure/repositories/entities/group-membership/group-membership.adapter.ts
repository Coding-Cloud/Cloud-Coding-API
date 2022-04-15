import { GroupMembershipEntity } from './group-membership.entity';
import { GroupMembership } from '../../../../domain/group-membership/group-membership';

export default class GroupMembershipAdapter {
  static toGroupMembership(
    groupMembership: GroupMembershipEntity,
  ): GroupMembership {
    const { userId, groupId, canEdit } = groupMembership;
    return {
      canEdit,
      groupId,
      userId,
    };
  }

  static toGroupMembershipEntity(
    groupMembership: GroupMembership,
  ): GroupMembershipEntity {
    return {
      ...groupMembership,
    };
  }
}
