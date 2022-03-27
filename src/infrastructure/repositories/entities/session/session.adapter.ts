import { Session } from 'src/domain/session/session';
import { SessionEntity } from './session.entity';

export default class SessionAdapter {
  static toSession(session: SessionEntity): Session {
    const { id, userId, token } = session;
    return {
      id,
      userId,
      token,
    };
  }
}
