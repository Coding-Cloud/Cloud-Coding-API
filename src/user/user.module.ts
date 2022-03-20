import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { bcryptEncrypt } from './auth/encrypt/bcrypt-encrypt';
import { NestJwtEncrypt } from './auth/jwt/jwt.service';
import { typeormUsers } from './infrastructure/typeorm-users';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [
    { provide: 'Users', useClass: typeormUsers },
    { provide: 'Encrypt', useClass: bcryptEncrypt },
    { provide: 'JwtEncrypt', useClass: NestJwtEncrypt },
    AuthService,
  ],
  controllers: [AuthController],
  exports: [{ provide: 'Users', useClass: typeormUsers }],
})
export class UserModule {}
