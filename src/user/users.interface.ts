import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { UserEntity } from './user.entity';

@Injectable()
export interface Users {
  createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>;
  findBy(props: { id?: string; username?: string }): Promise<UserEntity>;
}
