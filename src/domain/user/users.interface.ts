import { AuthCredentialsDto } from '../../infrastructure/controllers/auth/dto/auth-credentials.dto';
import { User } from './user';

export interface Users {
  createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>;
  findBy(props: { id?: string; username?: string }): Promise<User>;
}
