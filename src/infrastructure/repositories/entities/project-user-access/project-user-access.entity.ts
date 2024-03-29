import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AccessType } from '../../../../domain/project-user-access/access-type.enum';

@Entity('project_user_access')
export class ProjectUserAccessEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: false })
  userId: string;

  @Column('uuid', { nullable: false })
  projectId: string;

  @Column({ nullable: false })
  accessType: AccessType;
}
