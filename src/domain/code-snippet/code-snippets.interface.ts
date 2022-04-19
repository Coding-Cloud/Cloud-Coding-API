import { CreateUserDTO } from 'src/infrastructure/web/controllers/auth/dto/create-user.dto';
import { CodeSnippet } from './code-snippet';

export interface CodeSnippets {
  createUser(createUserDTO: CreateUserDTO): Promise<void>;

  findByPostId(postId: string): Promise<CodeSnippet>;
}
