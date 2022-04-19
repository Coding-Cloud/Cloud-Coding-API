import { CreateUserDTO } from 'src/infrastructure/web/controllers/auth/dto/create-user.dto';
import { Asset } from './asset';

export interface Assets {
  createUser(createUserDTO: CreateUserDTO): Promise<void>;

  findByPostId(postId: string): Promise<Asset>;
}
