import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sessions } from 'src/domain/session/session.interface';
import { SessionEntity } from 'src/infrastructure/entities/session/session.entity';
import { JwtEncrypt } from 'src/infrastructure/jwt/jwt-encrypt';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormSessionsRespository implements Sessions {
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
  async findByUserId(userId: string): Promise<SessionEntity[]> {
    return await this.sessionEntityRepository.find({ where: userId });
  }
  async findByToken(token: string): Promise<SessionEntity> {
    return await this.sessionEntityRepository.findOne({ where: token });
  }
}
