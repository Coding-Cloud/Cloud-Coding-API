import {
  EmailApiSendEmailArgs,
  EmailApiSendEmailResponse,
  EmailApiSendResetPasswordEmailArgs,
} from './mail-types';
import { Email } from 'node-mailjet';
import { MailApi } from './mail-api.abstract';

export type BuildEmailResetPasswordArgs = {
  emailVerificationLink: string;
};

export type BuildLinkResetPasswordArgs = {
  emailVerificationToken: string;
};

export class MailjetMailApi implements MailApi {
  private transporter: Email.Client;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    this.transporter = require('node-mailjet').connect(
      process.env.SMTP_APIKEY_PUBLIC as string,
      process.env.SMTP_APIKEY_PRIVATE as string,
    );
  }

  async sendResetPasswordEmail(
    args: EmailApiSendResetPasswordEmailArgs,
  ): Promise<EmailApiSendEmailResponse> {
    const { toEmail, tokenGenerate } = args;
    if (!tokenGenerate) {
      return {
        toEmail: toEmail,
        status: 'error',
      };
    }
    const emailVerificationLink = this.buildEmailVerificationLink({
      emailVerificationToken: tokenGenerate,
    });
    const subject = "Hi it's CloudCoding! Password reset";
    const textBody = this.buildResetPasswordEmailTextBody({
      emailVerificationLink,
    });
    const htmlBody = this.buildResetPasswordEmailHtmlBody({
      emailVerificationLink,
    });
    await this.sendEmail({ toEmail, subject, textBody, htmlBody });
    return {
      toEmail: toEmail,
      status: 'success',
    };
  }

  private async sendEmail(args: EmailApiSendEmailArgs): Promise<void> {
    const { toEmail, subject, textBody, htmlBody } = args;

    const res = await this.transporter
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MAIL_SENDER,
              Name: process.env.MAIL_SENDER_NAME,
            },
            To: [
              {
                Email: toEmail,
              },
            ],
            Subject: subject,
            TextPart: textBody,
            HTMLPart: htmlBody,
          },
        ],
      });
  }

  private buildResetPasswordEmailTextBody(args: BuildEmailResetPasswordArgs) {
    const { emailVerificationLink } = args;

    return `Welcome to CloudCoding, the coolest app to try your code! Please click on the link below (or copy it to your browser) to reset your password. ${emailVerificationLink}`;
  }

  private buildResetPasswordEmailHtmlBody(args: BuildEmailResetPasswordArgs) {
    const { emailVerificationLink } = args;

    return `
        <h1>Welcome to CloudCoding</h1>
        <br/>
        the coolest app to try your code!
        <br/>
        <br/>
        Please click on the link below (or copy it to your browser) to reset your password:
        <br/>
        <br/>
        <a href="${emailVerificationLink}">${emailVerificationLink}</a>`;
  }

  private buildEmailVerificationLink = (
    args: BuildLinkResetPasswordArgs,
  ): string => {
    const { emailVerificationToken } = args;

    return `${process.env.FRONT_URL}:${process.env.FRONT_PORT}/reset/${emailVerificationToken}`;
  };
}
