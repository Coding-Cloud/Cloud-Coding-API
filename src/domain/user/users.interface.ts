import { AuthCredentialsDto } from '../../infrastructure/controllers/auth/dto/auth-credentials.dto';
import { UserEntity } from '../../infrastructure/entities/user.entity';

export interface Users {
  createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>;
  findBy(props: { id?: string; username?: string }): Promise<UserEntity>;
}
