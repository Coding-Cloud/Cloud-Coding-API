import { TypeormGroupMembershipsRepository } from '../../infrastructure/repositories/repositories/typeorm-group-memberships.repository';
import { GroupMembership } from '../../domain/group-membership/group-membership';

export class FindGroupMembersUseCase {
  constructor(
    private readonly groupMemberships: TypeormGroupMembershipsRepository,
  ) {}

  async findGroupMembers(groupId: string): Promise<GroupMembership[]> {
    return this.groupMemberships.findByGroupId(groupId);
  }
}
