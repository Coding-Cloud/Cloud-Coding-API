import { UnauthorizedException } from '@nestjs/common';
import { Users } from '../../domain/user/users.interface';
import { AuthCredentialsDto } from 'src/infrastructure/web/controllers/auth/dto/auth-credentials.dto';
import { Encrypt } from 'src/domain/encrypt.interface';
import { JwtPayload } from 'src/infrastructure/web/jwt/jwt-payload.interface';
import { JwtEncrypt } from 'src/infrastructure/web/jwt/jwt-encrypt.abstract';
import { Sessions } from 'src/domain/session/session.interface';

export class SignInUseCases {
  constructor(
    private readonly users: Users,
    private readonly encrypt: Encrypt,
    private readonly jwtEncrypt: JwtEncrypt,
    private readonly sessions: Sessions,
  ) {}

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.users.findBy({ username });

    if (user && (await this.encrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtEncrypt.sign(payload);
      await this.sessions.createSession(user.id, accessToken);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
