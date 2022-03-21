import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigModule } from 'src/infrastructure/config/typeorm/typeorm-config.module';
import { EncryptModule } from 'src/infrastructure/encrypt/encrypt.module';
import { UserEntity } from 'src/infrastructure/entities/user.entity';
import { TypeormUsersRespository } from './typeorm-users.repository';

@Module({
  imports: [
    TypeormConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    EncryptModule,
  ],
  providers: [TypeormUsersRespository],
  exports: [TypeormUsersRespository],
})
export class RepositoriesModule {}
