import { JwtPayload } from './jwt-payload.interface';

export abstract class JwtEncrypt {
  abstract sign(jwtPayload: JwtPayload): string;
}
