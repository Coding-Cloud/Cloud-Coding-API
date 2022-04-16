import { GroupMembership } from './group-membership';

export interface GroupMemberships {
  joinGroup(userId: string, groupId): Promise<void>;

  leaveGroup(userId: string, groupId): Promise<void>;

  findByUserId(userId: string): Promise<GroupMembership[]>;

  findByGroupId(groupId: string): Promise<GroupMembership[]>;
}
