import { CreateUserDTO } from 'src/infrastructure/web/controllers/auth/dto/create-user.dto';
import { Follower } from './follower';

export interface Followers {
  createUser(createUserDTO: CreateUserDTO): Promise<void>;

  findById(id: string): Promise<Follower>;
}
