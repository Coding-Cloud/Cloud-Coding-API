import { UserSocketEntity } from './user-socket.entity';
import { UserSocket } from '../../../../domain/user-socket/user-socket';

export default class UserSocketAdapter {
  static toUserSocket(session: UserSocketEntity): UserSocket {
    const { id, userId, socketId } = session;
    return {
      id,
      userId,
      socketId,
    };
  }
}
