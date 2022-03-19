import { Module } from '@nestjs/common';
import { typeormUsers } from './infrastructure/typeorm-users';

@Module({
  providers: [{ provide: 'Users', useClass: typeormUsers }],
  exports: [],
})
export class UserModule {}
