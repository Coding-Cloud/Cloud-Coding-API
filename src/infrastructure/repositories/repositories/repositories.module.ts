import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigModule } from 'src/infrastructure/config/typeorm/typeorm-config.module';
import { EncryptModule } from 'src/infrastructure/encrypt/encrypt.module';
import { PasswordResetEntity } from 'src/infrastructure/entities/password-reset/password-reset.entity';
import { SessionEntity } from 'src/infrastructure/entities/session/session.entity';
import { UserEntity } from 'src/infrastructure/entities/user/user.entity';
import { TypeormPasswordResetRespository } from './typeorm-password-reset.repository';
import { TypeormSessionsRespository } from './typeorm-session.repository';
import { TypeormUsersRespository } from './typeorm-users.repository';
import { ProjectEntity } from '../../entities/project/project.entity';
import { TypeormProjectsRepository } from './typeorm-projects.repository';

@Module({
  imports: [
    TypeormConfigModule,
    TypeOrmModule.forFeature([
      UserEntity,
      SessionEntity,
      PasswordResetEntity,
      ProjectEntity,
    ]),
    EncryptModule,
  ],
  providers: [
    TypeormUsersRespository,
    TypeormSessionsRespository,
    TypeormPasswordResetRespository,
    TypeormProjectsRepository,
  ],
  exports: [
    TypeormUsersRespository,
    TypeormSessionsRespository,
    TypeormPasswordResetRespository,
    TypeormProjectsRepository,
  ],
})
export class RepositoriesModule {}
