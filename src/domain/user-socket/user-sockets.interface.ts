import { UserSocket } from './user-socket';
import { CreateUserSocketCandidate } from '../../usecases/user-socket/candidates/create-user-socket.candidate';

export interface UserSockets {
  findUserSockets(instance?: boolean): Promise<UserSocket[]>;

  findByUserId(userId: string, instance?: boolean): Promise<UserSocket>;

  addUserSocket(candidate: CreateUserSocketCandidate): Promise<string>;

  deleteUserSocket(socketId: string): Promise<void>;

  findConversationUserSockets(
    conversationId: string,
    instance?: boolean,
  ): Promise<UserSocket[]>;
}
