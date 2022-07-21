import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity('follower')
export class FollowerEntity {
  @Column('uuid', { primary: true })
  followerId: string;

  @Column('uuid', { primary: true })
  followedId: string;

  @CreateDateColumn()
  createdAt: Date;
}
