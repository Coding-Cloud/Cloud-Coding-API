import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigModule } from '../config/typeorm/typeorm-config.module';
import { UserEntity } from './entities/user/user.entity';
import { SessionEntity } from './entities/session/session.entity';
import { PasswordResetEntity } from './entities/password-reset/password-reset.entity';
import { ProjectEntity } from './entities/project/project.entity';
import { EncryptModule } from '../encrypt/encrypt.module';
import { TypeormUsersRespository } from './repositories/typeorm-users.repository';
import { TypeormSessionsRespository } from './repositories/typeorm-session.repository';
import { TypeormPasswordResetRespository } from './repositories/typeorm-password-reset.repository';
import { TypeormProjectsRepository } from './repositories/typeorm-projects.repository';

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
