import { InjectRepository } from '@nestjs/typeorm';
import { PasswordReset } from 'src/domain/user/password-reset';
import { PasswordResets } from 'src/domain/user/password-resets.interface';
import { User } from 'src/domain/user/user';
import PasswordResetAdapter from 'src/infrastructure/repositories/entities/password-reset/password-reset.adapter';
import { PasswordResetEntity } from 'src/infrastructure/repositories/entities/password-reset/password-reset.entity';
import UserAdapter from 'src/infrastructure/repositories/entities/user/user.adapter';
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

  async findByUser(user: User): Promise<PasswordReset> {
    const passwordResetEntity =
      await this.passwordResetEntityRepository.findOne({
        where: { user },
      });
    return PasswordResetAdapter.toPasswordReset(passwordResetEntity);
  }

  async findByToken(token: string): Promise<PasswordReset> {
    const passwordResetEntity =
      await this.passwordResetEntityRepository.findOne({
        where: { token },
      });

    return passwordResetEntity
      ? PasswordResetAdapter.toPasswordReset(passwordResetEntity)
      : null;
  }

  async delete(passwordreset: PasswordReset): Promise<void> {
    this.passwordResetEntityRepository.delete(passwordreset);
  }
}
