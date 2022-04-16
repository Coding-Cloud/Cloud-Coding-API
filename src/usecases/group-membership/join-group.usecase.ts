import { GroupMemberships } from '../../domain/group-membership/group-memberships.interface';
import { Logger } from '@nestjs/common';

export class JoinGroupUseCase {
  constructor(private readonly groupMemberships: GroupMemberships) {}

  async joinGroup(userId: string, groupId: string): Promise<void> {
    await this.groupMemberships.joinGroup(userId, groupId);
    Logger.log(`User {${userId}} joined group {${groupId}}`);
  }
}
