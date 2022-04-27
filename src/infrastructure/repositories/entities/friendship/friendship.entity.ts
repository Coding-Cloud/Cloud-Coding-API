import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('friendship')
export class FriendshipEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { primary: true })
  user1Id: string;

  @Column('uuid', { primary: true })
  user2Id: string;

  @Column('uuid', { nullable: false })
  conversationId: string;

  @CreateDateColumn()
  createdAt: Date;
}
