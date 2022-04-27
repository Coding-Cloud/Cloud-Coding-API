import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: false })
  ownerId: string;

  @Column('uuid', { nullable: false })
  postId: string;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: true })
  startLine?: number;

  @Column({ nullable: true })
  endLine?: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
