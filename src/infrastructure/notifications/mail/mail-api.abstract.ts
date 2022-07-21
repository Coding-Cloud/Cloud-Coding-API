import {
  EmailApiSendEmailResponse,
  EmailApiSendResetPasswordEmailArgs,
} from './mail-types';

export abstract class MailApi {
  abstract sendResetPasswordEmail(
    args: EmailApiSendResetPasswordEmailArgs,
  ): Promise<EmailApiSendEmailResponse>;
}
