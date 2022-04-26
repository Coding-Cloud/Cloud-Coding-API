import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('code_snippet')
export class CodeSnippetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: false })
  projectId: string;

  @Column({ nullable: false })
  filename: string;

  @Column({ nullable: false })
  language: string;

  @Column({ nullable: false })
  startLine: number;

  @Column({ nullable: false })
  endLine: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
