import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity('follower')
export class FollowerEntity {
  @Column({ primary: true })
  followerId: string;

  @Column({ primary: true })
  followedId: string;

  @CreateDateColumn()
  createdAt: Date;
}
