import { Module } from '@nestjs/common';
import { Encrypt } from 'src/domain/encrypt.interface';
import { BcryptEncrypt } from './bcrypt-encrypt';

@Module({
  providers: [{ provide: Encrypt, useClass: BcryptEncrypt }],
  exports: [Encrypt],
})
export class EncryptModule {}
