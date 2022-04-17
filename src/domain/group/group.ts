import { GroupMembership } from '../group-membership/group-membership';

export class Group {
  id: string;
  name: string;
  ownerId: string;
  conversationId: string;
  createdWithProject: boolean;
  members?: GroupMembership[];
  createdAt: Date;
}
