import { JwtPayload } from './jwt-payload.interface';
import { JwtEncrypt } from './jwt-encrypt.abstract';
import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class NestJwtEncrypt implements JwtEncrypt {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}

  sign(jwtPayload: JwtPayload): string {
    return this.jwtService.sign(jwtPayload);
  }
}
