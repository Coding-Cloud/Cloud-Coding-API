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

  @Column({ nullable: false })
  ownerId: string;

  @Column({ nullable: false, default: true })
  createdWithProject: boolean;

  @Column({ nullable: false })
  conversationId: string;

  @OneToMany(() => GroupMembershipEntity, (members) => members.group)
  members?: GroupMembershipEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
