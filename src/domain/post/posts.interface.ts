import { CreateUserDTO } from 'src/infrastructure/web/controllers/auth/dto/create-user.dto';
import { Post } from './post';

export interface Posts {
  createUser(createUserDTO: CreateUserDTO): Promise<void>;

  findByUserId(userId: string): Promise<Post>;
}
