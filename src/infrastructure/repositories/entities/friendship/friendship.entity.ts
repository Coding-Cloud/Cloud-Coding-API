import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity('friendship')
export class FriendshipEntity {
  @Column({ primary: true })
  user1Id: string;

  @Column({ primary: true })
  user2Id: string;

  @CreateDateColumn()
  createdAt: Date;
}
