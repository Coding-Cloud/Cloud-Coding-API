import { GroupMemberships } from '../../domain/group-membership/group-memberships.interface';

export class UpdateGroupMembershipUseCase {
  constructor(private readonly groupMemberships: GroupMemberships) {}

  async updateGroupMembership(
    userId: string,
    groupId: string,
    canEdit: boolean,
  ): Promise<void> {
    await this.groupMemberships.updateGroupMembership(userId, groupId, canEdit);
  }
}
