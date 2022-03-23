import { PasswordResets } from 'src/domain/user/password-resets.interface';
import { User } from 'src/domain/user/user';
import { v4 as uuidv4 } from 'uuid';

export class resetPasswordUseCases {
  constructor(private readonly passwordResets: PasswordResets) {}

  async reset(user: User): Promise<void> {
    const token = uuidv4();
    return await this.passwordResets.createPasswordResets(user, token);
  }

  async verifResetToken(user: User, token: string): Promise<boolean> {
    const passwordReset = await this.passwordResets.findByUser(user);
    return token === passwordReset.token;
  }
}
