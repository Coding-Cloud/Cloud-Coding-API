import { GroupMembership } from '../../domain/group-membership/group-membership';
import { GroupMemberships } from '../../domain/group-membership/group-memberships.interface';

export class FindUserGroupsUseCase {
  constructor(private readonly groupMemberships: GroupMemberships) {}

  async findUserGroups(userId: string): Promise<GroupMembership[]> {
    return await this.groupMemberships.findByUserId(userId);
  }
}
