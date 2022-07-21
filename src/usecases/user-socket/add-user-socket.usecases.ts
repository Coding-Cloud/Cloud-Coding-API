import { UserSockets } from '../../domain/user-socket/user-sockets.interface';
import { CreateUserSocketCandidate } from './candidates/create-user-socket.candidate';

export class AddUserSocketUseCases {
  constructor(private userSockets: UserSockets) {}

  addUserSocket(userSocket: CreateUserSocketCandidate): Promise<string> {
    return this.userSockets.addUserSocket(userSocket);
  }
}
