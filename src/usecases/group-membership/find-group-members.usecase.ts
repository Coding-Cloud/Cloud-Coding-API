import { GroupMembership } from '../../domain/group-membership/group-membership';
import { GroupMemberships } from '../../domain/group-membership/group-memberships.interface';

export class FindGroupMembersUseCase {
  constructor(private readonly groupMemberships: GroupMemberships) {}

  async findGroupMembers(groupId: string): Promise<GroupMembership[]> {
    return this.groupMemberships.findByGroupId(groupId);
  }
}
