import { CreateUserDTO } from 'src/infrastructure/controllers/auth/dto/create-user.dto';
import { User } from './user';

export interface Users {
  createUser(createUserDTO: CreateUserDTO): Promise<void>;
  findBy(props: {
    id?: string;
    username?: string;
    email?: string;
  }): Promise<User>;
  changePassword(user: User, password: string): Promise<void>;
  findUserByResetPassword(token: string): Promise<User>;
}
