import { UserEditing } from './user-editing';
import { CreateUserEditingCandidate } from '../../usecases/user-editing/candidates/create-user-editing.candidate';

export interface UserEditingList {
  findUserEditingList(): Promise<UserEditing[]>;

  findByRoom(room: string): Promise<UserEditing[]>;

  addUserEditing(candidate: CreateUserEditingCandidate): Promise<string>;

  deleteUserEditingBySocketId(socketId: string): Promise<void>;

  deleteUserEditingByRoom(room: string): Promise<void>;
}
