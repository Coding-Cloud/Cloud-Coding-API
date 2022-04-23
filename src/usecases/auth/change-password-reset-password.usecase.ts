import { BadRequestException } from '@nestjs/common';
import { Encrypt } from 'src/domain/encrypt.interface';
import { PasswordResets } from 'src/domain/user/password-resets.interface';
import { Users } from 'src/domain/user/users.interface';

export class ChangePasswordresetPasswordUseCases {
  constructor(
    private readonly users: Users,
    private readonly encrypt: Encrypt,
    private readonly passwordResets: PasswordResets,
  ) {}

  async change(password: string, token: string): Promise<void> {
    const user = await this.users.findUserByResetPassword(token);
    if (!user) throw new BadRequestException();
    const salt = await this.encrypt.genSaltkey();
    const hashedPassword = await this.encrypt.hash(password, salt);
    await this.users.changePassword(user, hashedPassword);
    const passwordReset = await this.passwordResets.findByToken(token);
    await this.passwordResets.delete(passwordReset);
  }
}
