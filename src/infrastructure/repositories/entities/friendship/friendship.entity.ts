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

  @Column({ primary: true })
  user1Id: string;

  @Column({ primary: true })
  user2Id: string;

  @CreateDateColumn()
  createdAt: Date;
}
