import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user-editing')
export class UserEditingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  socketId: string;

  @Column({ nullable: false })
  room: string;
}
