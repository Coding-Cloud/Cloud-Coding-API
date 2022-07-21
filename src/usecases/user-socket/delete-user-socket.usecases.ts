import { UserSockets } from '../../domain/user-socket/user-sockets.interface';

export class DeleteUserSocketUseCases {
  constructor(private userSockets: UserSockets) {}

  deleteUserSocket(socketId: string): Promise<void> {
    return this.userSockets.deleteUserSocket(socketId);
  }
}
