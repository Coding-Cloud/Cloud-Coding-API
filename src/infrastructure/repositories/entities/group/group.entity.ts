import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupMembershipEntity } from '../group-membership/group-membership.entity';

@Entity('group')
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column('uuid', { nullable: false })
  ownerId: string;

  @Column({ nullable: false, default: true })
  isHidden: boolean;

  @OneToMany(() => GroupMembershipEntity, (members) => members.group)
  members?: GroupMembershipEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
