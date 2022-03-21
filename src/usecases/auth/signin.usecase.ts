import { UnauthorizedException } from '@nestjs/common';
import { Users } from '../../domain/user/users.interface';
import { AuthCredentialsDto } from 'src/infrastructure/controllers/auth/dto/auth-credentials.dto';
import { Encrypt } from 'src/domain/encrypt.interface';
import { JwtPayload } from 'src/infrastructure/jwt/jwt-payload.interface';
import { JwtEncrypt } from 'src/infrastructure/jwt/jwt-encrypt';

export class signInUseCases {
  constructor(
    private readonly users: Users,
    private readonly encrypt: Encrypt,
    private readonly jwtEncrypt: JwtEncrypt,
  ) {}

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.users.findBy({ username });

    if (user && (await this.encrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtEncrypt.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
