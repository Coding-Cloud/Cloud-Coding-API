import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/domain/session/session';
import { Sessions } from 'src/domain/session/session.interface';
import SessionAdapter from 'src/infrastructure/repositories/entities/session/session.adapter';
import { SessionEntity } from 'src/infrastructure/repositories/entities/session/session.entity';
import { Repository } from 'typeorm';

export class TypeormSessionsRepository implements Sessions {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionEntityRepository: Repository<SessionEntity>,
  ) {}

  async createSession(userId: string, token: string): Promise<void> {
    const session = await this.sessionEntityRepository.create({
      userId,
      token,
    });
    await this.sessionEntityRepository.save(session);
  }

  async findByUserId(userId: string): Promise<Session[]> {
    const sessionsEntities = await this.sessionEntityRepository.find({
      where: { userId },
    });
    return sessionsEntities.map((sessionEntity) =>
      SessionAdapter.toSession(sessionEntity),
    );
  }

  async findByToken(token: string): Promise<Session> {
    const sessionEntity = await this.sessionEntityRepository.findOne({
      token,
    });
    return SessionAdapter.toSession(sessionEntity);
  }

  async deleteByToken(token: string): Promise<void> {
    await this.sessionEntityRepository.delete({ token });
  }
}
