import { UserSockets } from '../../domain/user-socket/user-sockets.interface';
import { UserSocket } from '../../domain/user-socket/user-socket';

export class FindUserSocketUseCases {
  constructor(private userSockets: UserSockets) {}

  findUserSocket(userId: string, instance?: boolean): Promise<UserSocket> {
    return this.userSockets.findByUserId(userId, instance);
  }

  findUserSockets(instance?: boolean): Promise<UserSocket[]> {
    return this.userSockets.findUserSockets(instance);
  }

  findConversationUserSockets(
    conversationId: string,
    instance?: boolean,
  ): Promise<UserSocket[]> {
    return this.userSockets.findConversationUserSockets(
      conversationId,
      instance,
    );
  }
}
