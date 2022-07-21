import { SessionEntity } from 'src/infrastructure/repositories/entities/session/session.entity';

export interface Sessions {
  createSession(userId: string, token: string): Promise<void>;

  findByUserId(userId: string): Promise<SessionEntity[]>;

  findByToken(token: string): Promise<SessionEntity>;

  deleteByToken(token: string): Promise<void>;
}
