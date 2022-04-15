import { CreateUserDTO } from 'src/infrastructure/web/controllers/auth/dto/create-user.dto';
import { Comment } from './comment';

export interface Comments {
  createUser(createUserDTO: CreateUserDTO): Promise<void>;

  findByUserId(userId: string): Promise<Comment>;
}
