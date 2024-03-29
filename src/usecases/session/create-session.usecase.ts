import { Sessions } from 'src/domain/session/session.interface';

export class CreateSessionUseCases {
  constructor(private readonly sessions: Sessions) {}

  async createSession(userId: string, token: string): Promise<void> {
    return this.sessions.createSession(userId, token);
  }
}
