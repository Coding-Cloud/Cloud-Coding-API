import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from 'src/user/users.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtEncrypt } from './jwt/jwt-service.interface';
import { Encrypt } from './encrypt/encrypt.interface';
import { JwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('Users')
    private users: Users,
    @Inject('JwtEncrypt')
    private jwtEncrypt: JwtEncrypt,
    @Inject('Encrypt')
    private encrypt: Encrypt,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.users.createUser(authCredentialsDto);
  }

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
