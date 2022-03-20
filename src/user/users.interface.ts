import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './auth/dto/auth-credentials.dto';
import { UserEntity } from './user.entity';

export interface Users {
  createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>;
  findBy(props: { id?: string; username?: string }): Promise<UserEntity>;
}
