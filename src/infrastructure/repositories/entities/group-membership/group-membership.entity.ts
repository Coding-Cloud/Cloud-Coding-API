import { Column, Entity, ManyToOne } from 'typeorm';
import { GroupEntity } from '../group/group.entity';

@Entity('group_membership')
export class GroupMembershipEntity {
  @Column('uuid', { primary: true })
  userId: string;

  @Column('uuid', { primary: true })
  groupId: string;

  @ManyToOne(() => GroupEntity, (group) => group.members, {
    primary: true,
    lazy: true,
  })
  group?: GroupEntity;

  @Column({ nullable: false })
  canEdit: boolean;
}
