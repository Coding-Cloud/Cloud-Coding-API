export type EmailApiSendEmailArgs = {
  subject: string;
  textBody: string;
  htmlBody: string;
  toEmail: string;
  tokenGenerate?: string;
};

export type EmailApiSendResetPasswordEmailArgs = {
  toEmail: string;
  tokenGenerate?: string;
};

export type EmailApiSendEmailResponse = {
  toEmail: string;
  status: 'success' | 'error';
};
