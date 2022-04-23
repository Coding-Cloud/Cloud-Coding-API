import { Sessions } from 'src/domain/session/session.interface';

export class DeleteSessionUseCases {
  constructor(private readonly sessions: Sessions) {}

  async deleteSessionByToken(token: string): Promise<void> {
    return this.sessions.deleteByToken(token);
  }
}
