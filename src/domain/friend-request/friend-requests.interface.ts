import { CreateUserDTO } from 'src/infrastructure/web/controllers/auth/dto/create-user.dto';
import { FriendRequest } from './friend-request';

export interface FriendRequests {
  createUser(createUserDTO: CreateUserDTO): Promise<void>;

  findById(id: string): Promise<FriendRequest>;
}
