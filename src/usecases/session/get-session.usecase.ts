import { Session } from 'src/domain/session/session';
import { Sessions } from 'src/domain/session/session.interface';

export class getSessionUseCases {
  constructor(private readonly sessions: Sessions) {}

  async getSessionByToken(token: string): Promise<Session> {
    return this.sessions.findByToken(token);
  }
}
