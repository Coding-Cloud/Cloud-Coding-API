import { Encrypt } from './encrypt.interface';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class bcryptEncrypt implements Encrypt {
  async compare(plainText: string, encryptText: string): Promise<boolean> {
    return bcrypt.compare(plainText, encryptText);
  }
  async genSaltkey(): Promise<string> {
    return await bcrypt.genSalt();
  }
  async hash(plainText: string, saltKey: string): Promise<string> {
    return bcrypt.hash(plainText, saltKey);
  }
}
