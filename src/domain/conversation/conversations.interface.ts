import { CreateUserDTO } from 'src/infrastructure/web/controllers/auth/dto/create-user.dto';
import { Conversation } from './conversation';

export interface Conversations {
  createUser(createUserDTO: CreateUserDTO): Promise<void>;

  findByUserId(userId: string): Promise<Conversation>;
}
