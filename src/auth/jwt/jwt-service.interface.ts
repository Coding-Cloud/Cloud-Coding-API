import { JwtPayload } from './jwt-payload.interface';

export interface JwtEncrypt {
  sign(jwtPayload: JwtPayload): string;
}
