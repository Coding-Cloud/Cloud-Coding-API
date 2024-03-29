import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectLanguage } from '../../../../domain/project/project-language.enum';
import { ProjectStatus } from '../../../../domain/project/project-status.enum';
import { ProjectVisibility } from '../../../../domain/project/project-visibility.enum';

@Entity('project')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({
    nullable: false,
    unique: true,
    update: false,
  })
  uniqueName: string;

  @Column({ nullable: false, default: 1 })
  lastVersion: number;

  @Column('enum', { enum: ProjectLanguage, nullable: false })
  language: ProjectLanguage;

  @Column('enum', { enum: ProjectStatus, nullable: false })
  status: ProjectStatus;

  @Column('enum', { enum: ProjectVisibility, nullable: false })
  globalVisibility: ProjectVisibility;

  @Column('uuid', { nullable: false })
  creatorId: string;

  @Column('uuid', { nullable: false })
  groupId: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
