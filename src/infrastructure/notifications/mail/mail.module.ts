import { Module } from '@nestjs/common';
import { MailApi } from './mail-api.abstract';
import { MailjetMailApi } from './mailjet-mail-api';

@Module({
  providers: [{ provide: MailApi, useClass: MailjetMailApi }],
  exports: [MailApi],
})
export class MailModule {}
