import { GroupMembership } from './group-membership';

export interface GroupMemberships {
  joinGroup(userId: string, groupId: string): Promise<void>;

  leaveGroup(userId: string, groupId: string): Promise<void>;

  findByUserId(userId: string): Promise<GroupMembership[]>;

  findByGroupId(groupId: string): Promise<GroupMembership[]>;

  updateGroupMembership(
    userId: string,
    groupId: string,
    canEdit: boolean,
  ): Promise<void>;
}
