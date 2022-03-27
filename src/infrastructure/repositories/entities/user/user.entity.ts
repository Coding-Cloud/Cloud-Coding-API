import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordResetEntity } from '../password-reset/password-reset.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(
    (_type) => PasswordResetEntity,
    (passwordReset) => passwordReset.user,
    {
      eager: false,
    },
  )
  passworsdResets: PasswordResetEntity[];
}
