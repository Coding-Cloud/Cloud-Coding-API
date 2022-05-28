import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user-socket')
export class UserSocketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ unique: true })
  socketId: string;

  @Column('uuid')
  instanceId: string;
}
