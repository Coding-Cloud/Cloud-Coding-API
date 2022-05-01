import { Session } from 'src/domain/session/session';
import { Sessions } from 'src/domain/session/session.interface';
import { NotFoundException } from '@nestjs/common';

export class GetSessionUseCases {
  constructor(private readonly sessions: Sessions) {}

  async getSessionByToken(token: string): Promise<Session | null> {
    return this.sessions.findByToken(token);
  }
}
