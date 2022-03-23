import { Sessions } from 'src/domain/session/session.interface';

//NOT USE YET IMPLEMENT WITH EVENT
export class createSessionUseCases {
  constructor(private readonly sessions: Sessions) {}

  async createSession(userId: string, token: string): Promise<void> {
    return this.sessions.createSession(userId, token);
  }
}
