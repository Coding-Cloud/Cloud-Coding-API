import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtEncrypt } from './jwt-encrypt.abstract';
import { NestJwtEncrypt } from './nest-jwt-encrypt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [{ provide: JwtEncrypt, useClass: NestJwtEncrypt }],
  exports: [JwtEncrypt],
})
export class JwtEncryptModule {}
