import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectStatusEnum } from '../../../domain/project/project-status.enum';
import { ProjectLanguageEnum } from '../../../domain/project/project-language.enum';

@Entity('project')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column('enum', { enum: ProjectLanguageEnum, nullable: false })
  language: ProjectLanguageEnum;

  @Column('enum', { enum: ProjectStatusEnum, nullable: false })
  status: ProjectStatusEnum;
}
