import { CreateUserDTO } from 'src/infrastructure/web/controllers/auth/dto/create-user.dto';
import { Friendship } from './friendship';

export interface Friendships {
  createUser(createUserDTO: CreateUserDTO): Promise<void>;

  findByUserId(userId: string): Promise<Friendship>;
}
