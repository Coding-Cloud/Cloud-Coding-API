import { TypeormGroupMembershipsRepository } from '../../infrastructure/repositories/repositories/typeorm-group-memberships.repository';
import { GroupMembership } from '../../domain/group-membership/group-membership';

export class FindUserGroupsUseCase {
  constructor(
    private readonly groupMemberships: TypeormGroupMembershipsRepository,
  ) {}

  async findUserGroups(userId: string): Promise<GroupMembership[]> {
    return await this.groupMemberships.findByUserId(userId);
  }
}
