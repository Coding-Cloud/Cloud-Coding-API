import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity('friend_request')
export class FriendRequestEntity {
  @Column('uuid', { primary: true })
  requesterUserId: string;

  @Column('uuid', { primary: true })
  requestedUserId: string;

  @CreateDateColumn()
  createdAt: Date;
}
