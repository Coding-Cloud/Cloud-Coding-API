import { Module } from '@nestjs/common';
import { typeormUsers } from 'src/user/infrastructure/typeorm-users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
