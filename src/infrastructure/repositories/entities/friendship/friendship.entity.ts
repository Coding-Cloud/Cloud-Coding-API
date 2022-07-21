import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('friendship')
@Unique(['user1Id', 'user2Id'])
export class FriendshipEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user1Id: string;

  @Column('uuid')
  user2Id: string;

  @CreateDateColumn()
  createdAt: Date;
}
