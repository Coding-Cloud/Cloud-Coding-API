import { PasswordResets } from 'src/domain/user/password-resets.interface';
import { Users } from 'src/domain/user/users.interface';
import { MailApi } from 'src/infrastructure/notifications/mail/mail-api.abstract';
import { v4 as uuidv4 } from 'uuid';

export class ResetPasswordUseCases {
  constructor(
    private readonly passwordResets: PasswordResets,
    private readonly mailApi: MailApi,
    private readonly users: Users,
  ) {}

  async reset(email: string): Promise<void> {
    const token = uuidv4();
    const user = await this.users.findBy({ email });
    await this.passwordResets.createPasswordResets(user, token);
    this.mailApi.sendResetPasswordEmail({
      toEmail: process.env.MAIL_RECEIVER as string,
      tokenGenerate: token,
    });
  }

  async verifResetToken(token: string): Promise<boolean> {
    const passwordReset = await this.passwordResets.findByToken(token);
    return token === passwordReset.token;
  }
}
