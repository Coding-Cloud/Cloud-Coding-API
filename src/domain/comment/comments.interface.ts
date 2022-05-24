import { CreateUserDTO } from 'src/infrastructure/web/controllers/auth/dto/create-user.dto';
import { Comment } from './comment';

export interface Comments {
  findProjectComments(createUserDTO: CreateUserDTO): Promise<Comment[]>;

  createComment(createUserDTO: CreateUserDTO): Promise<string>;

  deleteComment(): Promise<void>;
}
