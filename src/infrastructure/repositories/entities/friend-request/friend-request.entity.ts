import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity('friend_request')
export class FriendRequestEntity {
  @Column({ primary: true })
  requesterUserId: string;

  @Column({ primary: true })
  requestedUserId: string;

  @CreateDateColumn()
  createdAt: Date;
}
