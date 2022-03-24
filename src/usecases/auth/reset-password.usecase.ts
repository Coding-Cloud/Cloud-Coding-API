import { PasswordResets } from 'src/domain/user/password-resets.interface';
import { User } from 'src/domain/user/user';
import { MailApi } from 'src/infrastructure/mail/mail-api.abstract';
import { MailjetMailApi } from 'src/infrastructure/mail/mailjet-mail-api';
import { v4 as uuidv4 } from 'uuid';

export class resetPasswordUseCases {
  constructor(
    private readonly passwordResets: PasswordResets,
    private readonly mailApi: MailApi,
  ) {}

  async reset(user: User): Promise<void> {
    const token = uuidv4();
    await this.passwordResets.createPasswordResets(user, token);
    this.mailApi.sendResetPasswordEmail({
      toEmail: process.env.MAIL_RECEIVER as string,
      tokenGenerate: token,
    });
  }

  async verifResetToken(user: User, token: string): Promise<boolean> {
    const passwordReset = await this.passwordResets.findByUser(user);
    return token === passwordReset.token;
  }
}
