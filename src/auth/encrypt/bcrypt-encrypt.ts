import { Encrypt } from './encrypt.interface';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class bcryptEncrypt implements Encrypt {
  compare(plainText: string, encryptText: string): boolean {
    return bcrypt.compare(plainText, encryptText);
  }
  genSaltkey(): string {
    return bcrypt.saltKey();
  }
  hash(plainText: string, saltKey: string): string {
    return bcrypt.hash(plainText, saltKey);
  }
}
