import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigModule } from 'src/infrastructure/config/typeorm/typeorm-config.module';
import { EncryptModule } from 'src/infrastructure/encrypt/encrypt.module';
import { SessionEntity } from 'src/infrastructure/entities/session/session.entity';
import { UserEntity } from 'src/infrastructure/entities/user/user.entity';
import { TypeormSessionsRespository } from './typeorm-session.repository';
import { TypeormUsersRespository } from './typeorm-users.repository';

@Module({
  imports: [
    TypeormConfigModule,
    TypeOrmModule.forFeature([UserEntity, SessionEntity]),
    EncryptModule,
  ],
  providers: [TypeormUsersRespository, TypeormSessionsRespository],
  exports: [TypeormUsersRespository, TypeormSessionsRespository],
})
export class RepositoriesModule {}
