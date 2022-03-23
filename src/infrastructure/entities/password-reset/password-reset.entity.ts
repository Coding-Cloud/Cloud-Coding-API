import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('password_reset')
export class PasswordResetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne((_type) => UserEntity, (user) => user.passworsdResets, {
    eager: false,
  })
  user: UserEntity;
}
