import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResets } from 'src/domain/user/password-resets.interface';
import { User } from 'src/domain/user/user';
import { PasswordResetEntity } from 'src/infrastructure/entities/password-reset/password-reset.entity';
import UserAdapter from 'src/infrastructure/entities/user/user.adapter';
import { UserEntity } from 'src/infrastructure/entities/user/user.entity';
import { Repository } from 'typeorm';

export class TypeormPasswordResetRespository implements PasswordResets {
  constructor(
    @InjectRepository(PasswordResetEntity)
    private readonly passwordResetEntityRepository: Repository<PasswordResetEntity>,
  ) {}
  async createPasswordResets(user: User, token: string): Promise<void> {
    const passwordReset = await this.passwordResetEntityRepository.create({
      token,
    });
    passwordReset.user = UserAdapter.toUserEntity(user);
    await this.passwordResetEntityRepository.save(passwordReset);
  }
}
