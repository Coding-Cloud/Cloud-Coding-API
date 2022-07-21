import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordResetEntity } from '../password-reset/password-reset.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  birthdate: Date;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => PasswordResetEntity, (passwordReset) => passwordReset.user, {
    eager: false,
  })
  passwordResets: PasswordResetEntity[];
}
