import { GroupMemberships } from '../../domain/group-membership/group-memberships.interface';
import { Logger } from '@nestjs/common';

export class LeaveGroupUseCase {
  constructor(private readonly groupMemberships: GroupMemberships) {}

  async leaveGroup(userId: string, groupId: string): Promise<void> {
    await this.groupMemberships.leaveGroup(userId, groupId);
    Logger.log(`User {${userId}} left group {${groupId}}`);
  }
}
