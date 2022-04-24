import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AccessType } from '../../../../domain/project-user-access/access-type.enum';

@Entity('project-user-access')
export class ProjectUserAccessEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  projectId: string;

  @Column({ nullable: false })
  accessType: AccessType;
}
