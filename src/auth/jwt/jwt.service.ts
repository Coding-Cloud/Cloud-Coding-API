import { Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { JwtEncrypt } from './jwt-service.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class NestJwtEncrypt implements JwtEncrypt {
  constructor(private jwtService: JwtService) {}

  sign(jwtPayload: JwtPayload): string {
    return this.jwtService.sign(jwtPayload);
  }
}
