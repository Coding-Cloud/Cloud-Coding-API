import { AuthCredentialsDto } from 'src/infrastructure/controllers/auth/dto/auth-credentials.dto';
import { Users } from '../../domain/user/users.interface';

export class signUpUseCases {
  constructor(private readonly users: Users) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.users.createUser(authCredentialsDto);
  }
}
