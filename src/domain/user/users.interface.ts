import { CreateUserDTO } from 'src/infrastructure/web/controllers/auth/dto/create-user.dto';
import { User } from './user';
import { UpdateUserCandidate } from '../../usecases/user/candidates/update-user.candidate';

export interface Users {
  createUser(createUserDTO: CreateUserDTO): Promise<void>;

  findBy(props: {
    id?: string;
    username?: string;
    email?: string;
  }): Promise<User>;

  changePassword(id: string, password: string): Promise<void>;

  updateUser(userId: string, userCandidate: UpdateUserCandidate): Promise<void>;

  findUserByResetPassword(token: string): Promise<User>;

  searchUsers(search: string): Promise<User[]>;

  getUsers(
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<[User[], number]>;
}
