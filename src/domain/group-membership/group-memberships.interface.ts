import { GroupMembership } from './group-membership';

export interface GroupMemberships {
  createGroupMembership(userId: string, groupId): Promise<void>;

  findByUserId(userId: string): Promise<GroupMembership[]>;

  findByGroupId(groupId: string): Promise<GroupMembership[]>;
}
