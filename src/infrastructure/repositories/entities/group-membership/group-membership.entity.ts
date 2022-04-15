import { Column, Entity } from 'typeorm';

@Entity('group_membership')
export class GroupMembershipEntity {
  @Column({ primary: true })
  userId: string;

  @Column({ primary: true })
  groupId: string;

  @Column({ nullable: false })
  canEdit: boolean;
}
